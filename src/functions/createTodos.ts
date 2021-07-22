import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const id = uuidv4();
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  const todoContent = await document.put(
    {
      TableName: "todos",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline,
      },
    }
  ).promise();

  console.log(todoContent);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "TODO Created!",
      content: {
        id,
        user_id,
        title,
        done: false,
        deadline
      },
  }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}