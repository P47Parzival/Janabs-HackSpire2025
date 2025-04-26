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

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Google AI embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Store active conversations
conversations = {}

class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    conversation_id: str

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

            # Create vector store
            vectorstore = Chroma.from_documents(chunks, embeddings)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 