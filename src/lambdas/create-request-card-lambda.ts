import { SQSEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { saveCard } from "../services/cardRepository";

interface Card {
  cardId: string;
  userId: string;
  type: "DEBIT" | "CREDIT";
  status: "PENDING" | "ACTIVATED";
  balance: number;
  createdAt: string;
  score?: number;
}

async function sendNotification(message: any) {
  console.log("📩 Notificación enviada:", message);
}

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { userId, request } = body;

    const cardId = uuidv4();
    let newCard: Card;

    if (request === "DEBIT") {
      newCard = {
        cardId,
        userId,
        type: "DEBIT",
        status: "ACTIVATED",
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      await sendNotification({
        type: "CARD.CREATE",
        userId,
        cardId,
        cardType: "DEBIT",
        amount: 0,
      });
    } else if (request === "CREDIT") {
      const score = Math.floor(Math.random() * 101);
      const amount = 100 + (score / 100) * (10000000 - 100);

      newCard = {
        cardId,
        userId,
        type: "CREDIT",
        status: "PENDING",
        balance: amount,
        createdAt: new Date().toISOString(),
        score,
      };

      await sendNotification({
        type: "CARD.CREATE",
        userId,
        cardId,
        cardType: "CREDIT",
        amount,
      });
    } else {
      console.error(`❌ Tipo de request no soportado: ${request}`);
      continue;
    }

    await saveCard(newCard);
    console.log(`💾 Tarjeta guardada en DynamoDB:`, newCard);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Mensajes procesados con éxito" }),
  };
};
