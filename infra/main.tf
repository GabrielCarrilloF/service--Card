provider "aws" {
  region  = "us-east-1"
  profile = "dev8"
}

# Cola de entrada para solicitudes de tarjeta
resource "aws_sqs_queue" "create_request_card_sqs" {
  name = "create-request-card-sqs"
}

# Cola de errores (Dead Letter Queue)
resource "aws_sqs_queue" "error_create_request_card_sqs" {
  name = "error-create-request-card-sqs"
}

# Rol de ejecución para la Lambda
resource "aws_iam_role" "lambda_role" {
  name = "card-service-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Políticas para que la Lambda use SQS y CloudWatch Logs
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_sqs_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
}

# Lambda que procesará solicitudes de tarjeta
resource "aws_lambda_function" "create_request_card_lambda" {
  function_name = "create-request-card-lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/lambdas/create-request-card-lambda.handler"
  runtime       = "nodejs18.x"

  filename         = "${path.module}/../dist/card-service.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/card-service.zip")

  environment {
    variables = {
      QUEUE_NAME = aws_sqs_queue.create_request_card_sqs.name
    }
  }
}

# Evento que conecta la SQS con la Lambda
resource "aws_lambda_event_source_mapping" "sqs_event" {
  event_source_arn = aws_sqs_queue.create_request_card_sqs.arn
  function_name    = aws_lambda_function.create_request_card_lambda.arn
  batch_size       = 1
}
