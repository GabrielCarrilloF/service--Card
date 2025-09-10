import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CARDS_TABLE || "CardsTable";

export const saveCard = async (card: any) => {
  await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: card,
    })
    .promise();
};
