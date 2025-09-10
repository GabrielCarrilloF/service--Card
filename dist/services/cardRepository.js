"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCard = saveCard;
exports.getCard = getCard;
const aws_sdk_1 = require("aws-sdk");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CARDS_TABLE || "CardsTable";
async function saveCard(card) {
    await dynamoDb
        .put({
        TableName: TABLE_NAME,
        Item: card,
    })
        .promise();
}
async function getCard(cardId) {
    const result = await dynamoDb
        .get({
        TableName: TABLE_NAME,
        Key: { cardId },
    })
        .promise();
    return result.Item || null;
}
