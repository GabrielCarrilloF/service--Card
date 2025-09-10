resource "aws_dynamodb_table" "cards" {
  name         = "CardsTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "cardId"

  attribute {
    name = "cardId"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Service     = "card-service"
  }
}
