"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const cardRepository_1 = require("../services/cardRepository");
async function sendNotification(message) {
    console.log("📩 Notificación enviada:", message);
}
const handler = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const { userId, request } = body;
        const cardId = (0, uuid_1.v4)();
        let newCard;
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
        }
        else if (request === "CREDIT") {
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
        }
        else {
            console.error(`❌ Tipo de request no soportado: ${request}`);
            continue;
        }
        await (0, cardRepository_1.saveCard)(newCard);
        console.log(`💾 Tarjeta guardada en DynamoDB:`, newCard);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Mensajes procesados con éxito" }),
    };
};
exports.handler = handler;
