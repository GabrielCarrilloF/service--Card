"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = sendNotification;
const aws_sdk_1 = require("aws-sdk");
const sqs = new aws_sdk_1.SQS();
async function sendNotification(queueUrl, message) {
    await sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
    }).promise();
}
