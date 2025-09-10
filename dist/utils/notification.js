"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const aws_sdk_1 = require("aws-sdk");
const sqs = new aws_sdk_1.SQS();
const queueUrl = process.env.NOTIFICATION_QUEUE_URL;
const sendNotification = async (eventType, payload) => {
    await sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({ eventType, payload }),
    }).promise();
};
exports.sendNotification = sendNotification;
