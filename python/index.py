from fastapi import FastAPI, File, Request
from pdfminer.high_level import extract_text
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import List, Dict

from inference import (
    generate_report,
    update_report,
    analyze_report,
    generate_image,
    get_by_ticker,
    converse_report,
)

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
    request: Request,
    file: Annotated[bytes, File()],
):
    with open(f"my_file/{request.client.host}.pdf", "wb") as binary_file:
        binary_file.write(file)
    with open(f"my_file/{request.client.host}.txt", "w") as text_file:
        text = extract_text(f"my_file/{request.client.host}.pdf")
        text_file.write(text)


@app.get("/analyze_report")
async def analyze_report_get(
    request: Request,
):
    with open(f"my_file/{request.client.host}.txt", "r") as text_file:
        return analyze_report(text_file.read())


class ChatHistoryRequest(BaseModel):
    chat_history: List[dict]


@app.post("/converse_report")
async def converse_report_get(
    request: Request,
    request_body: ChatHistoryRequest,
):
    with open(f"my_file/{request.client.host}.txt", "r") as text_file:
        bedrock_response = converse_report(text_file.read(), request_body.chat_history)
        return StreamingResponse(bedrock_response)


class GetCompanyRequest(BaseModel):
    ticker: str


@app.post("/analyze_ticker")
async def analyze_ticker_post(
    request: Request,
    request_body: GetCompanyRequest,
):
    company = get_by_ticker(request_body.ticker)[0]
    filename = f"esgs/text/{company['filename']}.txt"
    with open(filename, "r") as text_file:
        with open(f"my_file/{request.client.host}.txt", "w") as f:
            f.write(text_file.read())

    with open(f"esgs/{company['filename']}", "rb") as binary_file:
        with open(f"my_file/{request.client.host}.pdf", "wb") as f:
            f.write(binary_file.read())


class GenerateReportRequest(BaseModel):
    description: str
    fields: List[Dict[str, float]]


@app.post("/generate_report")
async def api_generate_report(
    request_body: GenerateReportRequest,
):
    print(request_body)
    bedrock_response = generate_report(request_body.description, request_body.fields)
    return StreamingResponse(bedrock_response)


class UpdateReportRequest(BaseModel):
    suggestions: str
    report_markdown: str


@app.post("/update_report")
async def api_update_report(request_body: UpdateReportRequest):
    bedrock_response = update_report(
        request_body.suggestions, request_body.report_markdown
    )
    return StreamingResponse(bedrock_response)


class GenerateImageRequeset(BaseModel):
    description: str


@app.post("/generate_image")
async def api_generate_image(
    request_body: GenerateImageRequeset,
):
    bedrock_response = generate_image(request_body.description)
    return {"image": bedrock_response}


@app.post("/get_company")
async def api_get_company(
    request_body: GetCompanyRequest,
):
    return get_by_ticker(request_body.ticker)


@app.get("/get_file")
async def api_get_file(
    request: Request,
):
    file_path = f"my_file/{request.client.host}.pdf"
    response = FileResponse(path=file_path, media_type="application/pdf", filename="report.pdf")
    response.headers["Content-Disposition"] = "inline"
    return response
