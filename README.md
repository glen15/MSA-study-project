# MSA-study-project

1. terrafom init & terraform apply
- 생성되는 리소스
  - item database RDS(mysql)
  - factory database RDS(mysql)
  - sample_data.sql을 사용해서 데이터베이스에 샘플 데이터 입력
2. aws cli를 통해 sqs, sns 생성
  - SNS SQS 구독 연결은 콘솔에서 수동 생성
  - shop api .env에 Topic Arn 기록
3. serverless framework를 이용해서 람다 생성
  - shop-api-lambda 생성
  - 콘솔에서 shop-api-lambda-dev-ap-northeast-2-lambdaRole에 SNS Publish 추가

