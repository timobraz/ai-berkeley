import boto3
import json
from typing import List

client = boto3.client(service_name="bedrock-agent-runtime")
bdclient = boto3.client(service_name="bedrock-runtime")


def update_pdf(history: List[dict], markdown: str):
    # model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    model_id = "anthropic.claude-3-haiku-20240307-v1:0"

    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 256,
        "temperature": 0.2,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
                            I am analyzing the Environmental Social Governance of top SNP 500 companies. 
                            I need you to extract some imperative and specific information from this report. 
                            I need each generated value being a perfect representation of its field name given the corresponding constraints. 
                            ALL VALUES MUST BE NUMBERS WITHOUT COMMAS IN GIVEN UNITS, FORMATTED . KEYS THAT CANNOT BE EXTRACTED MUST BE OMITTED WITHOUT PLACEHOLDERS. 
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
                            Here is the document: 
                        """
                        + text,
                    }
                ],
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Here are my extracted JSON metrics without any further commentary, with null keys omitted, comments omitted:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = bdclient.invoke_model(modelId=model_id, body=request)
    model_response = json.loads(response["body"].read())
    response_text = model_response["content"][0]["text"]


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

    return response["retrieveResults"]


def generate_report(prompt: str, filters: List[dict]):
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

    response = client.retrieve_and_generate(
        input={"text": prompt},
        retrieveAndGenerateConfiguration={
            "knowledgeBaseConfiguration": {
                "generationConfiguration": {
                    "inferenceConfig": {
                        "textInferenceConfig": {
                            "maxTokens": 512,
                            "stopSequences": [
                                "string",
                            ],
                            "temperature": 0.1,
                            "topP": 0.1,
                        }
                    },
                    "promptTemplate": {
                        "textPromptTemplate": f"""
                        You are a environmental social governance report generating agent. I will provide you with a set of search results, these results are fragments of reports that you will mimic in style and content. The user will provide information about their own reporting company, and the search results will be relevant to your task. Using what you have been given, and what you know about environmental social governance reports, generate an environmental social governance report document in markdown format. 

                        Here is a short description of the reporting company: {prompt}

                        Here are the search results in numbered order:
                        $search_results$

                        A environmental social governance report in markdown format:
                    """
                    },
                },
                "knowledgeBaseId": "06LZWOGIFB",
                "modelArn": "anthropic.claude-3-sonnet-20240229-v1:0",
                "retrievalConfiguration": {"vectorSearchConfiguration": config},
            },
            "type": "KNOWLEDGE_BASE",
        },
    )

    return response["output"]["text"]


if __name__ == "__main__":
    print(generate_report("I am ", []))
