from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import shutil
import google.generativeai as genai
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import json
import uuid
from datetime import datetime
import time
from tenacity import retry, stop_after_attempt, wait_exponential

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google AI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

# Configure Google AI
genai.configure(
    api_key=GOOGLE_API_KEY,
    transport='rest'
)

# Initialize Google AI embeddings with retry logic
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    reraise=True
)
def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GOOGLE_API_KEY
    )

embeddings = get_embeddings()

# Store active conversations
conversations = {}

class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    conversation_id: str

class YouTubeRequest(BaseModel):
    url: str

class LearningAnalysisRequest(BaseModel):
    input: str

class LearningPath(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    progress: int
    topics: List[str]

class Quiz(BaseModel):
    id: str
    title: str
    topic: str
    difficulty: str
    questions: int
    completed: bool

class Summary(BaseModel):
    id: str
    topic: str
    content: str
    date: str

class LearningAnalysisResponse(BaseModel):
    learning_paths: List[LearningPath]
    quizzes: List[Quiz]
    summaries: List[Summary]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            # Save the uploaded file to the temporary file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        try:
            # Load and process the PDF
            loader = PyPDFLoader(temp_file_path)
            pages = loader.load()

            if not pages:
                raise HTTPException(status_code=400, detail="The PDF file appears to be empty")

            # Split the text into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            chunks = text_splitter.split_documents(pages)

            # Create vector store with retry logic
            @retry(
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=1, min=4, max=10),
                reraise=True
            )
            def create_vector_store():
                return Chroma.from_documents(chunks, embeddings)

            vectorstore = create_vector_store()

            # Create conversation chain with retry logic
            @retry(
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=1, min=4, max=10),
                reraise=True
            )
            def create_conversation_chain():
                memory = ConversationBufferMemory(
                    memory_key="chat_history",
                    return_messages=True
                )
                return ConversationalRetrievalChain.from_llm(
                    llm=ChatGoogleGenerativeAI(
                        model="gemini-1.5-flash",
                        temperature=0,
                        google_api_key=GOOGLE_API_KEY,
                        convert_system_message_to_human=True
                    ),
                    retriever=vectorstore.as_retriever(),
                    memory=memory
                )

            chain = create_conversation_chain()

            # Generate a unique conversation ID
            conversation_id = os.urandom(16).hex()
            conversations[conversation_id] = chain

            return {"conversation_id": conversation_id}

        except Exception as e:
            if "timeout" in str(e).lower():
                raise HTTPException(
                    status_code=504,
                    detail="The operation timed out. Please try again in a few moments."
                )
            elif "failed to connect" in str(e).lower():
                raise HTTPException(
                    status_code=503,
                    detail="Unable to connect to the AI service. Please try again later."
                )
            else:
                raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not request.conversation_id or request.conversation_id not in conversations:
            raise HTTPException(status_code=400, detail="Invalid conversation ID")

        chain = conversations[request.conversation_id]
        result = chain({"question": request.question})
        
        return ChatResponse(
            answer=result["answer"],
            conversation_id=request.conversation_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-youtube")
async def process_youtube(request: YouTubeRequest):
    try:
        # Extract video ID from URL
        video_id = None
        if 'youtube.com' in request.url:
            parsed_url = urlparse(request.url)
            video_id = parse_qs(parsed_url.query).get('v', [None])[0]
        elif 'youtu.be' in request.url:
            video_id = request.url.split('/')[-1]
        
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        # Get transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join([entry['text'] for entry in transcript])

        if not text:
            raise HTTPException(status_code=400, detail="No transcript found for this video")

        # Split the text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_text(text)

        # Create vector store
        vectorstore = Chroma.from_texts(chunks, embeddings)

        # Create conversation chain
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        chain = ConversationalRetrievalChain.from_llm(
            llm=ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                temperature=0,
                google_api_key=GOOGLE_API_KEY,
                convert_system_message_to_human=True
            ),
            retriever=vectorstore.as_retriever(),
            memory=memory
        )

        # Generate a unique conversation ID
        conversation_id = os.urandom(16).hex()
        conversations[conversation_id] = chain

        return {"conversation_id": conversation_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-learning", response_model=LearningAnalysisResponse)
async def analyze_learning(request: LearningAnalysisRequest):
    try:
        # Use the LLM to analyze the input and generate personalized content
        prompt = f"""
        Analyze the following learning goal and generate:
        1. A personalized learning path
        2. Relevant quizzes
        3. Key concept summaries

        Learning goal: {request.input}

        Format the response as a JSON object with the following structure:
        {{
            "learning_paths": [
                {{
                    "id": "unique_id",
                    "title": "Learning path title",
                    "description": "Detailed description",
                    "difficulty": "beginner/intermediate/advanced",
                    "progress": 0,
                    "topics": ["topic1", "topic2", ...]
                }}
            ],
            "quizzes": [
                {{
                    "id": "unique_id",
                    "title": "Quiz title",
                    "topic": "Topic name",
                    "difficulty": "easy/medium/hard",
                    "questions": 10,
                    "completed": false
                }}
            ],
            "summaries": [
                {{
                    "id": "unique_id",
                    "topic": "Topic name",
                    "content": "Summary content",
                    "date": "YYYY-MM-DD"
                }}
            ]
        }}
        """

        # Get response from the LLM
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        # Parse the response and return the structured data
        try:
            data = json.loads(response.text)
            return LearningAnalysisResponse(**data)
        except json.JSONDecodeError:
            # If the response isn't valid JSON, create a default response
            return LearningAnalysisResponse(
                learning_paths=[
                    LearningPath(
                        id=str(uuid.uuid4()),
                        title="Introduction to Topic",
                        description="A comprehensive learning path to get you started",
                        difficulty="beginner",
                        progress=0,
                        topics=["Basics", "Fundamentals"]
                    )
                ],
                quizzes=[
                    Quiz(
                        id=str(uuid.uuid4()),
                        title="Basic Concepts Quiz",
                        topic="Introduction",
                        difficulty="easy",
                        questions=5,
                        completed=False
                    )
                ],
                summaries=[
                    Summary(
                        id=str(uuid.uuid4()),
                        topic="Key Concepts",
                        content="Here are the main concepts you'll need to understand...",
                        date=datetime.now().strftime("%Y-%m-%d")
                    )
                ]
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 