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


    print(config)


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
                "height": 1024,
                "width": 1024,
                "cfgScale": 8.0,
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
    return base64_image

    # base64_bytes = base64_image.encode("ascii")
    # image_bytes = base64.b64decode(base64_bytes)
    # return image_bytes


def analyze_report(report_text: str):
    # model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 512,
        "temperature": 0.2,
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
                            ALL VALUES MUST BE NUMBERS WITHOUT COMMAS IN GIVEN UNITS. KEYS THAT CANNOT BE EXTRACTED MUST BE LEFT NULL. 
                            The response must conform to the following JSON format: 
                            {
                                \"energy_used\": \"number\" // Total energy used in Megawatt hours. 
                                \"percent_renewable_energy\": \"number\" // Percentage of energy that is generated from renewable sources. 
                                \"carbon_intensity\": \"number\" // Grams of CO2 equivalent per dollar of gross merchandise sales. 
                                \"total_water_withdrawn\": \"number\" // Cubic meters of water withdrawn. 
                                \"total_water_discharged\": \"number\" // Cubic meters of water discharged. 
                                \"total_water_consumed\": \"number\" // Cubic meters of water consumed. 
                                \"greenhouse_gas_emissions_scope_1\": \"number\" // Metric tonnes of CO2 equivalent of direct greenhouse emissions that occur from sources that are controlled or owned by an organization. 
                                \"greenhouse_gas_emissions_scope_2\": \"number\" // Metric tonnes of CO2 equivalent of indirect greenhouse emissions associated with the purchase of electricity, steam, heat. 
                                \"greenhouse_gas_emissions_scope_3\": \"number\" // Metric tonnes of CO2 equivalent of greenhouse emissions not owned by the reporting company, but that occur in the value chain of the reporting company. 
                                \"greenhouse_gas_datacenter_total_emissions\": \"number\" // Metric tonnes of CO2 equivalent of greenhouse emissions from data centers. 
                                \"greenhouse_gas_purchased_goods\": \"number\" // Metric tonnes of CO2 equivalent of greenhouse emissions from purchased goods. 
                                \"greenhouse_gas_capital_goods\": \"number\" // Metric tonnes of CO2 equivalent of greenhouse emissions from capital goods. 
                                \"waste_generated\": \"number\" // Metric tonnes of waste generated. 
                                \"waste_landfilled\": \"number\" // Metric tonnes of waste landfilled. 
                                \"waste_recycled\": \"number\" // Metric tonnes of waste recycled. 
                                \"air_emissions\": \"number\" // Metric tonnes of harmful air emissions. 
                            }. 
                            
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
                        "text": "Here is the generated diff of the markdown document:",
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
                            Feel free to include image tags in the markdown document with comprehensive alt text.
                            Modify the markdown document with the following inputs:

                            Here is the markdown document:
                            ```markdown
                            {report_markdown}
                            ```

                            Here are the new inputs:
                            {suggestions}

                            Respond with the git style diff of the markdown document, do not repeat the entire document.

                            The format of the diff should be as follows:
                            - old line
                            + new line
                        """,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is the generated git style diff of the markdown document, without repeating the entire document, and without any additional commentary or prefixes or suffixes:",
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
                            You are a environmental social governance report generating agent. I will provide you with a set of search results, these results are fragments of reports that you will mimic in style and content. The user will provide information about their own reporting company, and the search results will be relevant to your task. Using what you have been given, and what you know about environmental social governance reports, generate an environmental social governance report document in markdown format. Make your report as informative and detailed as possible, and include image tags in the markdown document with comprehensive alt text.

                            Here is a short description of the reporting company: 
                            {description}

                            Here are some key metrics that should be included in the report:
                            {key_metrics}

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
    processed_stream = parse_stream(response["body"])
    return processed_stream


if __name__ == "__main__":
    acc = ""
    for i in generate_report(
        "I am starting a software as a service buisness in London. I use a lot of energy for AI model training.",
        [{"revenue": 10000}, {"energy_used": 1000}],
    ):
        print(i)
        acc += i
    print(acc)

    diff = ""
    for i in update_report(
        "I need you to include a graph showing the downward trend of air emissions.",
        acc,
    ):
        print(i)
        diff += i
    print(diff)

    # image_bytes = generate_image(
    #     "A downward sloping graph showing lower and lower air emissions by a sustainable tech company."
    # )
    # with open("image.png", "wb") as f:
    #     f.write(image_bytes)

    # image = Image.open(io.BytesIO(image_bytes))
    # image.show()

    # print(analyze_report("text content here, pretend this is a report."))
