import boto3
import json
import base64
import io
import os
from typing import List
from PIL import Image

bdaclient = boto3.client(service_name="bedrock-agent-runtime")
bdclient = boto3.client(service_name="bedrock-runtime")


prefix = "esgs/metadata/"
metadata = []
for file in os.listdir(prefix):
    file_path = f"{prefix}{file}"
    with open(file_path, "r") as file:
        data = json.load(file)
        metadata.append(data)


def parse_stream(response_stream):
    for chunk in response_stream:
        chunk = json.loads(chunk["chunk"]["bytes"].decode("utf-8"))
        if chunk["type"] == "content_block_delta":
            yield chunk["delta"]["text"]


def get_by_ticker(ticker: str):
    output = []
    for data in metadata:
        if data["ticker"] == ticker:
            output.append(data)
    output = sorted(output, key=lambda x: x["year"], reverse=True)
    return output


def get_rag(prompt: str, filters: List[dict]):
    config = (
        {
            "filter": {
                "orAll": filters,
            },
            "numberOfResults": 100,
        }
        if len(filters) > 1
        else {
            "numberOfResults": 100,
        }
    )

    config = {
        "numberOfResults": 100,
    }

    response = bdaclient.retrieve(
        knowledgeBaseId="06LZWOGIFB",
        retrievalConfiguration={"vectorSearchConfiguration": config},
        retrievalQuery={"text": prompt},
    )

    return response["retrievalResults"]


def generate_image(prompt: str):
    body = json.dumps(
        {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {"text": prompt},
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "height": 512,
                "width": 512,
                "cfgScale": 4.0,
                "seed": 0,
            },
        }
    )

    model_id = "amazon.titan-image-generator-v1"

    response = bdclient.invoke_model(
        body=body,
        modelId=model_id,
        accept="application/json",
        contentType="application/json",
    )
    response_body = json.loads(response.get("body").read())

    base64_image = response_body.get("images")[0]
    # return base64_image

    base64_bytes = base64_image.encode("ascii")
    image_bytes = base64.b64decode(base64_bytes)
    return image_bytes


def analyze_report(report_text: str):
    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 512,
        "temperature": 0.25,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
                            I am analyzing the Environmental Social Governance reports of top tech companies. 
                            I need you to extract some imperative and specific information from this report. 
                            I need each generated value being a perfect representation of its field name given the corresponding constraints. 
                            ALL VALUES MUST BE NUMBERS WITHOUT COMMAS IN GIVEN UNITS. KEYS THAT CANNOT BE EXTRACTED MUST BE LEFT null. 
                            The response must conform to the following JSON format: 
                            {
                                \"greenhouse_gas_emissions\": {\"string]\": []\"number\" } // A list of greenhouse gas emissions, examples include CO2, CH4, N2O, and the corresponding values emitted for the last 5 years. THAT'S FIVE! ONE TWO THREE FOUR FIVE! ANY MORE OR ANY LESS AND I WILL KILL YOU!
                                \"biggest_climate_contributing_factors\": \"string\" // The biggest climate contributing factors.
                                \"biggest_places_to_improve\": \"string\" // The biggest places that the company can improve in.
                                \"score_energy_used\": \"number\" // Score for energy used, 0 to 150. THIS VALUE CANNOT BE NULL.
                                \"score_greenhouse_gas_emissions_scope_1\": \"number\" // Score for greenhouse gas emissions Scope 1, 0 to 150. THIS VALUE CANNOT BE NULL.
                                \"score_greenhouse_gas_emissions_scope_2\": \"number\" // Score for greenhouse gas emissions Scope 2, 0 to 150. THIS VALUE CANNOT BE NULL.
                                \"score_greenhouse_gas_emissions_scope_3\": \"number\" // Score for greenhouse gas emissions Scope 3, 0 to 150. THIS VALUE CANNOT BE NULL. 
                                \"score_water_withdrawn\": \"number\" // Score for water withdrawn, 0 to 150. THIS VALUE CANNOT BE NULL.
                                \"score_waste_generated\": \"number\" // Score for waste generated, 0 to 150. THIS VALUE CANNOT BE NULL.
                            }

                            IF YOU STRAY FROM THIS FORMAT I WILL KILL YOU!

                            Here is the report text to analyze:
                        """
                        + report_text,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is my analysis of this report in formatted JSON. I UNDERSTAND THAT FAILURE TO CONFORM TO THE GIVEN JSON FORMAT WILL RESULT IN MY DEATH. JSON:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model(modelId=model_id, body=request)
    model_response = json.loads(response.get("body").read())
    response_text = model_response["content"][0]["text"]
    return response_text


def converse_report(report_text: str, chat_history: List[dict]):
    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 256,
        "temperature": 0.5,
        "system": "You are a environmental social governance report generating agent. I will provide you with a ESG report, and you will provide me with insights and suggestions on how to formulate my own future reports.",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"""
                            I am analyzing the Environmental Social Governance reports of top tech companies. 
                            I have gathered a well composed Environmental Social Governance report, and I would like to have a conversation about it. 

                            Here is the report text to analyze:
                            {report_text}

                            {chat_history[0]["content"][0]["text"]}
                        """,
                    },
                ],
            },
        ]
        + chat_history[1:],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )
    processed_stream = parse_stream(response["body"])
    return processed_stream


def update_report(suggestions: str, report_markdown: str):
    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # model_id = "anthropic.claude-3-haiku-20240307-v1:0"

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
                            Be sure to include image tags in the markdown document with comprehensive alt text.
                            Include tables and graphs where necessary.
                            Modify the markdown document with the following inputs:

                            Here is the markdown document:
                            ```markdown
                            {report_markdown}
                            ```

                            Here are the new inputs:
                            {suggestions}

                            Images can be found at the following URLs: https://flowing-magpie-sweet.ngrok-free.app/image/<filename>
                            FOR IMAGES USE A MARKDOWN IMAGE TAG.
                            IF YOU STRAY FROM THIS IMAGE FORMAT I WILL KILL YOU!
                            DO NOT ENCODE NON ASCII CHARACTERS IN A FILENAME OR I WILL KILL YOU!

                            Respond with a new markdown document, with the given suggestions implemented.
                        """,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is the new markdown document, with the given suggestions implemented:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )
    processed_stream = parse_stream(response["body"])
    return processed_stream


def generate_report(description: str, fields: List[dict]):
    filters = [
        {
            "greaterThan": {
                "key": next(iter(field)),
                "value": next(iter(field.values())) * 0.75,
            }
        }
        for field in fields
    ]

    key_metrics = "\n".join([f"{i + 1}. {metric}" for i, metric in enumerate(fields)])

    retrieval_results = get_rag(description, filters)

    retrieval_results = "\n".join(
        [
            f"{i + 1}. {result['content']['text']}"
            for i, result in enumerate(retrieval_results)
        ]
    )

    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # model_id = "anthropic.claude-3-haiku-20240307-v1:0"

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
                            You are a environmental social governance report generating agent. 
                            I will provide you with a set of search results, these results are fragments of reports that you will mimic in style and content. 
                            The user will provide information about their own reporting company, and the search results will be relevant to your task. 
                            Using what you have been given, and what you know about environmental social governance reports, generate an environmental social governance report document in markdown format. 
                            Make your report as informative and detailed as possible, and be sure to include image tags in the markdown document with comprehensive alt text.

                            Here is a short description of the reporting company: 
                            {description}

                            Here are some key metrics that should be included in the report:
                            {key_metrics}

                            Here are the search results in numbered order:
                            {retrieval_results}

                            Images can be found at the following URLs: https://flowing-magpie-sweet.ngrok-free.app/image/<filename>
                            FOR IMAGES USE A MARKDOWN IMAGE TAG.
                            IF YOU STRAY FROM THIS IMAGE FORMAT I WILL KILL YOU!
                            DO NOT ENCODE NON ASCII CHARACTERS IN A FILENAME OR I WILL KILL YOU!
                        """,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is my Environmental Social Governance Report in markdown format, with correct mark img format:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )
    processed_stream = parse_stream(response["body"])
    return processed_stream


if __name__ == "__main__":
    # acc = ""
    # for i in generate_report(
    #     "I am starting a software as a service buisness in London. I use a lot of energy for AI model training.",
    #     [{"revenue": 10000}, {"energy_used": 1000}],
    # ):
    #     print(i)
    #     acc += i
    # print(acc)

    # diff = ""
    # for i in update_report(
    #     "I need you to include a graph showing the downward trend of air emissions.",
    #     acc,
    # ):
    #     print(i)
    #     diff += i
    # print(diff)

    image_bytes = generate_image(
        "A downward sloping graph showing lower and lower air emissions by a sustainable tech company."
    )
    with open("image.png", "wb") as f:
        f.write(image_bytes)

    image = Image.open(io.BytesIO(image_bytes))
    image.show()

    # print(analyze_report("text content here, pretend this is a report."))
