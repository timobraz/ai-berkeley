from fastapi import FastAPI, File
from pdfminer.high_level import extract_text
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict

from inference import generate_report, update_report, analyze_report, generate_image, get_by_ticker

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


@app.post("/analyze_report")
async def pdf(
    file: Annotated[bytes, File()],
):
    with open("my_file.pdf", "wb") as binary_file:
        binary_file.write(file)
        text = extract_text("my_file.pdf")
        return analyze_report(text)


class GenerateReportRequest(BaseModel):
    description: str
    fields: List[Dict[str, float]]


@app.post("/generate_report")
async def api_generate_report(
    request_body: GenerateReportRequest,
):
    print(request_body)
    bedrock_response = generate_report(request_body.description, request_body.fields)
    return StreamingResponse(
        bedrock_response,
        media_type="application/json",
    )


class UpdateReportRequest(BaseModel):
    suggestions: str
    report_markdown: str


@app.post("/update_report")
async def api_update_report(request_body: UpdateReportRequest):
    bedrock_response = update_report(
        request_body.suggestions, request_body.report_markdown
    )
    return StreamingResponse(
        bedrock_response,
        media_type="application/json",
    )


class GenerateImageRequeset(BaseModel):
    description: str


@app.post("/generate_image")
async def api_generate_image(
    request_body: GenerateImageRequeset,
):
    bedrock_response = generate_image(request_body.description)
    return {"image": bedrock_response}

class GetCompanyRequest(BaseModel):
    ticker: str

@app.post("/get_company")
async def api_get_company(
    request_body: GetCompanyRequest,
):
    return get_by_ticker(request_body.ticker)