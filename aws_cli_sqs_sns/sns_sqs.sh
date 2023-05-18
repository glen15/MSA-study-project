#!/bin/bash

# # ORDER SNS-SQS
# ### SNS order-topic 생성
order_topic_name="order-topic"
order_topic_arn=$(aws sns create-topic --name $order_topic_name --output text --query 'TopicArn')
echo "SNS order-topic created with ARN: $order_topic_arn"

# ### SQS order-queue생성
order_queue_name="order-queue"
order_queue_url=$(aws sqs create-queue --queue-name $order_queue_name --output text --query 'QueueUrl')
echo "SQS order-queue created with URL: $order_queue_url"



# Delivery SNS-SQS
### SNS delivery-topic 생성
delivery_topic_name="delivery-topic"
delivery_topic_arn=$(aws sns create-topic --name $delivery_topic_name --output text --query 'TopicArn')
echo "SNS delivery-topic created with ARN: $delivery_topic_arn"

### SQS delivery-queue생성
delivery_queue_name="delivery-queue"
delivery_queue_url=$(aws sqs create-queue --queue-name $delivery_queue_name --output text --query 'QueueUrl')
echo "SQS delivery-queue created with URL: $delivery_queue_url"


# SNS SQS 구독 연결은 콘솔에서 수동 생성

# shop api .env에 Topic Arn 기록
echo "TOPIC_ARN=$order_topic_arn" >> ../shop-api-lambda/.env
echo "Value from topic-arn.json added to .env file: TOPIC_ARN=$order_topic_arn"

# factory api .env에 Topic Arn 기록
echo "TOPIC_ARN=$delivery_topic_arn" >> ../factory-lambda/.env
echo "Value from topic-arn.json added to .env file: TOPIC_ARN=$delivery_topic_arn"