import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  
  const response = await document.scan({
    TableName: "users",
    ProjectionExpression: "username, id",
  }).promise();
  
  const [userAlreadyExists] = response.Items.filter(user => user.username === username);

  if(userAlreadyExists){
    return {
      statusCode: 409,
      body: JSON.stringify({
        error: "User Already Exists!"
      }),
      headers: {
        "Content-Type": "application/json"
      },
    };
  }

  const user_id = uuidv4();

  await document.put({
    TableName: "users",
    Item: {
      id: user_id,
      username,
      password: hash(password, 10),
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "User created successfully!",
      user: {
        id: user_id,
        username
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}