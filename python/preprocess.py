import os
import boto3
import json

from pdfminer.high_level import extract_text


client = boto3.client("bedrock-runtime")

model_id = "anthropic.claude-3-haiku-20240307-v1:0"


def preprocess_pdf(pdf_path):
    text = extract_text(pdf_path)

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
                            I am analyzing the Environmental Social Governance of top SNP 500 companies. 
                            I need you to extract some imperative and specific information from this report. 
                            I need each generated value being a perfect representation of its field name given the corresponding constraints. 
                            ALL VALUES MUST BE NUMBERS, IN GIVEN UNITS, WITHOUT COMMAS. KEYS THAT CANNOT BE EXTRACTED MUST BE OMITTED WITHOUT PLACEHOLDERS. 
                            The response must conform to the following JSON format: 
                            {
                                \"name\": \"string\" // Name of the company. 
                                \"ticker\": \"string\" // Ticker symbol of the company, you maybe derive this from the name and your knewledge of the company. 
                                \"year\": \"number\" // Year of the report. 
                                \"description\": \"string\" // Description of the company, you maybe derive this from the name and your knewledge of the company. 
                                \"revenue\": \"number\" // Total revenue in dollars. IF THIS FIELD CONTAINS A COMMA, I WILL KILL YOU!
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
                        "text": "Here are my extracted JSON metrics without any further commentary, with null keys omitted, property names enclosed in double quotes, NO COMMAS WITHIN NUMBERS OR I WILL DIE, and comments omitted:",
                    }
                ],
            },
        ],
    }

    request = json.dumps(native_request)
    response = client.invoke_model(modelId=model_id, body=request)
    model_response = json.loads(response["body"].read())
    response_text = model_response["content"][0]["text"]

    try:
        json_response = json.loads(response_text)
        no_nulls = {k: v for k, v in json_response.items() if v is not None}
        print(json.dumps(no_nulls, indent=4))
        return no_nulls
    except Exception as e:
        print(response_text)
        raise e


if __name__ == "__main__":
    prefix = "esgs/"

    for file in os.listdir(prefix):
        metadata_file = f"{prefix}metadata/{file}.metadata.json"
        if file.endswith(".pdf"):
            if os.path.exists(metadata_file):
                print('skipping: ', file)
                continue
            print("processing: ", file)
            metadata = preprocess_pdf(f"{prefix}{file}")
            metadata["filename"] = file
            with open(metadata_file, "w") as f:
                f.write(json.dumps({"metadataAttributes": metadata}, indent=4))
