import boto3
import json
from typing import List

client = boto3.client(service_name="bedrock-agent-runtime")
bdclient = boto3.client(service_name="bedrock-runtime")


def update_report(suggestions: str, report_markdown: str):
    # model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "temperature": 0.5,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"""
                            I am working on an Environmental Social Governance report. 
                            I have generated a markdown document, but I have some new inputs to modify it.
                            Modify the markdown document with the following inputs:

                            Here is the markdown document:
                            ```markdown
                            {report_markdown}
                            ```

                            Here are the new inputs:
                            {suggestions}

                            Respond with the diff of the markdown document. 
                        """,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is the generated diff of the markdown document:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )
    return response


def get_rag(prompt: str, filters: List[dict]):
    config = (
        {
            "filter": {
                "orAll": {
                    filters,
                },
            },
            "numberOfResults": 100,
        }
        if len(filters) > 0
        else {
            "numberOfResults": 100,
        }
    )

    response = client.retrieve(
        knowledgeBaseId="06LZWOGIFB",
        retrievalConfiguration={"vectorSearchConfiguration": config},
        retrievalQuery={"text": prompt},
    )

    return response["retrievalResults"]


def generate_report(description: str, filters: List[dict]):
    retrieval_results = get_rag(description, filters)

    retrieval_results = "\n".join(
        [
            f"{i + 1}. {result['content']['text']}"
            for i, result in enumerate(retrieval_results)
        ]
    )

    # model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "temperature": 0.5,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"""
                            You are a environmental social governance report generating agent. I will provide you with a set of search results, these results are fragments of reports that you will mimic in style and content. The user will provide information about their own reporting company, and the search results will be relevant to your task. Using what you have been given, and what you know about environmental social governance reports, generate an environmental social governance report document in markdown format. 

                            Here is a short description of the reporting company: {description}

                            Here are the search results in numbered order:
                            {retrieval_results}
                        """,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is my Environmental Social Governance Report in markdown format:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )
    return response["body"]


if __name__ == "__main__":
    acc = ''
    for i in generate_report("I am starting a software as a service buisness in London. I use a lot of energy for AI model training.", []):
        decoded = json.loads(i["chunk"]["bytes"].decode('utf-8'))
        if decoded["type"] == "content_block_delta":
            acc += decoded["delta"]["text"]
    print(acc)