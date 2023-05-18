# MSA-study-project

## 아키텍처
이미지 넣을 것,

---

## 개요
1. 유저가 구매요청 시 재고가 확보되어 있지 않다면 자동으로 생산 요청을 보내고 다시 재고를 확보하는 시스템 구성
2. 관리 워크로드를 줄이기 위한 서버리스 활용과 느슨한 결합을 위한 Message Queue 사용
3. 다양한 인프라 구성 방식을 활용 연습
  - terraform : Database
  - serverless faramework : lambda & api gateway
  - aws_cli : SNS & SQS

---

## 테스트 순서

### 1. 데이터베이스 구성
  - 경로 이동 : `cd terraform_db` 
  - variables.tf에서 데이터베이스 액세스 정보 설정
  - `terrafom init`, `terraform apply`
  - 생성되는 리소스
    - item database RDS(mysql)
    - factory database RDS(mysql)
  - terraform output을 통해 생성되는 connect_data.json에서 액세스 정보 확인 
    - item RDS에 접속 후 shop_db_data.sql을 사용해서 item database에 테이블 구성 및 샘플 데이터 입력
    - `SELECT * FROM items;`

        | item_id | name  | price  | quantity | factory_id |
        |---------|-------|--------|----------|------------|
        | 1       | Item1 | 10000  | 1        | 1          |
        | 2       | Item2 | 20000  | 2        | 2          |
        | 3       | Item3 | 30000  | 3        | 1          |
    - `SELECT * FROM factories;`
        | factory_id | name     | locate |
        |------------|----------|--------|
        | 1          | Factory1 | korea  |
        | 2          | Factory2 | usa    |
    - facory RDS에 접속 후 factory_db_data.sql을 사용해서 factory database에 테이블 구성 및 샘플 데이터 입력
    - `SELECT * FROM logs;`

      | log_id | factory_id | factory_name | item_id | item_name | quantity | requester | datetime            |
      |--------|------------|--------------|---------|-----------|----------|-----------|---------------------|
      |      1 |          1 | Factory1     |       1 | Item1     |        5 | jeonghun  | 2023-05-18 09:46:48 |

2. aws cli를 통해 sqs, sns 생성
  - SNS SQS 구독 연결은 콘솔에서 수동 생성
  - shop api .env에 Topic Arn 기록
3. serverless framework를 이용해서 람다 생성
  - shop-api-lambda 생성
  - 콘솔에서 shop-api-lambda-dev-ap-northeast-2-lambdaRole에 SNS Publish 추가

