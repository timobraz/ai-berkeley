from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello  World "}


@app.post("/pdf")
async def pdf(
    file: Annotated[bytes, File()],
):
    binary_file = open("my_file.pdf", "wb")
    binary_file.write(file)
    reader = PdfReader("my_file.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    binary_file.close()
    return {"text": text}
