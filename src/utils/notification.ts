import { SQS } from "aws-sdk";

const sqs = new SQS();
const queueUrl = process.env.NOTIFICATION_QUEUE_URL!;

export const sendNotification = async (eventType: string, payload: any) => {
  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ eventType, payload }),
  }).promise();
};
