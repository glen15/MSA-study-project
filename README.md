# MSA-study-project

## 아키텍처
이미지 넣을 것,

---

## 개요
1. 유저가 구매요청 시 재고가 확보되어 있지 않다면 자동으로 생산 요청을 보내고 다시 재고를 확보하는 시스템 구성

2. 관리 워크로드를 줄이기 위한 서버리스 활용과 느슨한 결합을 위한 Message Queue 사용

3. 다양한 인프라 구성 방식을 활용 연습
    - terraform : Database
    - serverless faramework : Lambda & API Gateway
    - aws_cli : SNS & SQS

---

## 인프라 구성

### 1. terraform을 이용한 데이터베이스 구성
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
---
### 2. aws cli를 이용한 SNS & SQS 생성 생성
- 경로 이동 : `cd aws_cli_sqs_sns`
- 실행 권한 부여 : `chmod +x sns_sqs.sh` 
- 스크립트 실행 : `./sns_sqs.sh`
    ```
    SNS order-topic created with ARN: $your_arn 
    SQS order-queue created with URL: $your_url
    SNS delivery-topic created with ARN: $your_arn 
    SQS delivery-queue created with URL: $your_url
    Value from topic-arn.json added to .env file: TOPIC_ARN=$your_arn 
    Value from topic-arn.json added to .env file: TOPIC_ARN=$your_arn 
    ```

- AWS 콘솔에서 SNS-SQS 구독연결
---
### 3. serverless framework를 이용한 shop-lambda 생성
- 경로 이동 : `cd shop-api-lambda`
- 디펜던시 설치 : `npm install`
- 배포 : `sls deploy`
- IAM 권한 부여
    ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": "sns:Publish",
                "Resource": "your_topic_arn"
            }
        ]
      }
    ```
- shop-lambda 테스트 : `curl -X GET your-shop-lambda-url/item`
  ```
  [
      {
          "item_id": 1,
          "name": "Item1",
          "price": 10000,
          "quantity": 1,
          "factory_id": 1
      },
      {
          "item_id": 2,
          "name": "Item2",
          "price": 20000,
          "quantity": 2,
          "factory_id": 2
      },
      {
          "item_id": 3,
          "name": "Item3",
          "price": 30000,
          "quantity": 3,
          "factory_id": 1
      }
  ]
  ```
  
---
### 4. serverless framework를 이용한 order-lambda 생성
- 경로 이동 : `cd order-lambda`
- 디펜던시 설치 : `npm install`
- 배포 : `sls deploy`
- factory-lambda url 설정 : 5. factory-lambda 생성 후 환경변수로 입력
---
### 5. serverless framework를 이용한 factory-lambda 생성
- 경로 이동 : `cd factory-lambda`
- 디펜던시 설치 : `npm install`
- 배포 : `sls deploy`
- IAM 권한 부여
    ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": "sns:Publish",
                "Resource": "your_topic_arn"
            }
        ]
      }
    ```
- order-lambda의 .env에 facotry-lambda url 설정
  `FACTORY_URL=your-factory-lambda-url/log`
- order-lambda 재배포 : `cd orderlmabda`, `sls deploy`
- factory-lambda 테스트 : `curl -X GET your-factory-lambda-url/log`
  ```
    [
      {
          "log_id": 1,
          "factory_id": 1,
          "factory_name": "Factory1",
          "item_id": 1,
          "item_name": "Item1",
          "quantity": 5,
          "requester": "jeonghun",
          "datetime": "2023-05-18T09:46:48.000Z"
      }
    ] 
  ```
---
### 6. serverless framework를 이용한 delivery-lambda 생성
- 경로 이동 : `cd delivery-lambda`
- 디펜던시 설치 : `npm install`
- 배포 : `sls deploy`
---

## 시스템 테스트
### 구매 요청으로 재고 없음 상태를 만들고, 생산 시간을 기다린 후 재 구매 요청
- request
  ```
    curl -X POST -H "Content-Type: application/json" -d '{
      "item_name": "Item2",
      "quantity": 5,
      "requester": "jeonghun"
    }' https://qktwji4sn7.execute-api.ap-northeast-2.amazonaws.com/item
  ```
- response
  - 재고 있을 때 : `{"message":"구매 완료! 남은 재고: 2"}% `
  - 재고 없을 때 : `{"message":"구매 실패! 남은 재고: 2, 생산요청 진행중"}%`
  - 생산 시간 대기 후 다시 구매요청