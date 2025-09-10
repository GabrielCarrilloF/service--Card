import { SQS } from "aws-sdk";

const sqs = new SQS();

export async function sendNotification(queueUrl: string, message: any) {
  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  }).promise();
}
