# MSA-study-project

### 아키텍처
이미지 넣을 것,

### 개요
1. 유저가 구매요청 시 재고가 확보되어 있지 않다면 자동으로 생산 요청을 보내고 다시 재고를 확보하는 시스템 구성
2. 관리 워크로드를 줄이기 위한 서버리스 활용과 느슨한 결합을 위한 Message Queue 사용
3. 다양한 인프라 구성 방식을 활용 연습
  - terraform : Database
  - serverless faramework : lambda & api gateway
  - aws_cli : SNS & SQS

### 테스트 순서
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

