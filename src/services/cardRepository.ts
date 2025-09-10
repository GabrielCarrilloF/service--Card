import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CARDS_TABLE || "CardsTable";

interface Card {
  cardId: string;
  userId: string;
  type: "DEBIT" | "CREDIT";
  status: "PENDING" | "ACTIVATED";
  balance: number;
  createdAt: string;
  score?: number;
}

export async function saveCard(card: Card): Promise<void> {
  await dynamoDb
    .put({
      TableName: TABLE_NAME,
      Item: card,
    })
    .promise();
}

export async function getCard(cardId: string): Promise<Card | null> {
  const result = await dynamoDb
    .get({
      TableName: TABLE_NAME,
      Key: { cardId },
    })
    .promise();

  return result.Item as Card || null;
}
