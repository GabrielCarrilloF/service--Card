"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const notification_1 = require("../utils/notification");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { cardId, amount, merchant } = body;
        if (!cardId || !amount || !merchant) {
            return { statusCode: 400, body: "Faltan datos obligatorios" };
        }
        // Obtener tarjeta
        const cardResp = await dynamoDb.get({
            TableName: "CardsTable",
            Key: { cardId },
        }).promise();
        const card = cardResp.Item;
        if (!card) {
            return { statusCode: 404, body: "Tarjeta no encontrada" };
        }
        // Validaciones según tipo de tarjeta
        if (card.type === "DEBIT") {
            if (card.balance < amount) {
                return { statusCode: 400, body: "Saldo insuficiente" };
            }
            card.balance -= amount;
        }
        else if (card.type === "CREDIT") {
            const used = card.usedBalance || 0;
            if (used + amount > card.balance) {
                return { statusCode: 400, body: "Límite de crédito excedido" };
            }
            card.usedBalance = used + amount;
        }
        // Actualizar tarjeta
        await dynamoDb.put({
            TableName: "CardsTable",
            Item: card,
        }).promise();
        // Registrar transacción
        const transaction = {
            transactionId: (0, uuid_1.v4)(),
            cardId,
            type: "PURCHASE",
            amount,
            merchant,
            date: new Date().toISOString(),
        };
        await dynamoDb.put({
            TableName: "TransactionsTable",
            Item: transaction,
        }).promise();
        // Enviar notificación
        await (0, notification_1.sendNotification)("TRANSACTION.PURCHASE", transaction);
        return { statusCode: 200, body: JSON.stringify(transaction) };
    }
    catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error interno" };
    }
};
exports.handler = handler;
