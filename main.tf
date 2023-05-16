provider "aws" {
  region = "ap-northeast-2"
}

// 람다 서버 코드
data "archive_file" "zip_the_js_code" {
  type        = "zip"
  source_dir  = "${path.module}/api_server_lambda/"
  output_path = "${path.module}/api_server_lambda/${var.code_version}.zip"
}

// 람다 함수 추가
resource "aws_lambda_function" "terraform_lambda_func" {
  filename      = "${path.module}/api_server_lambda/${var.code_version}.zip"
  function_name = "jh_Test_Lambda_Function"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  depends_on    = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
}
