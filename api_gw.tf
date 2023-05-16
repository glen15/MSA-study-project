resource "aws_api_gateway_rest_api" "terraform_api_gateway" {
  name        = "jhAPIGateway"
  description = "API Gateway for Lambda function"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "terraform_api_gateway_resource" {
  rest_api_id = aws_api_gateway_rest_api.terraform_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.terraform_api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_lambda_permission" "terraform_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terraform_lambda_func.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.terraform_api_gateway.execution_arn}/*/*/*"
}

resource "aws_api_gateway_method" "terraform_api_gateway_method" {
  rest_api_id   = aws_api_gateway_rest_api.terraform_api_gateway.id
  resource_id   = aws_api_gateway_resource.terraform_api_gateway_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "terraform_api_gateway_integration" {
  rest_api_id             = aws_api_gateway_rest_api.terraform_api_gateway.id
  resource_id             = aws_api_gateway_resource.terraform_api_gateway_resource.id
  http_method             = aws_api_gateway_method.terraform_api_gateway_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.terraform_lambda_func.invoke_arn
}

resource "aws_api_gateway_deployment" "terraform_api_gateway_deployment" {
  depends_on  = [aws_api_gateway_integration.terraform_api_gateway_integration]
  rest_api_id = aws_api_gateway_rest_api.terraform_api_gateway.id
  stage_name  = "dev"
}


output "api_gateway_invoke_url" {
  value = aws_api_gateway_deployment.terraform_api_gateway_deployment.invoke_url
}
