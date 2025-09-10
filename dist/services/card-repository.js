"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCard = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CARDS_TABLE || "CardsTable";
const saveCard = async (card) => {
    await dynamo
        .put({
        TableName: TABLE_NAME,
        Item: card,
    })
        .promise();
};
exports.saveCard = saveCard;
