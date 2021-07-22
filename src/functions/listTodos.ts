import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },    
  }).promise();

  if (!response.Items) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "User not found."
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: response.Items[id]
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}