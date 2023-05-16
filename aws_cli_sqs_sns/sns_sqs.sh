#!/bin/bash

# SNS Topic 생성
topic_name="order-topic"
topic_arn=$(aws sns create-topic --name $topic_name --output text --query 'TopicArn')
echo "SNS topic created with ARN: $topic_arn"

# SQS 생성
queue_name="order-queue"
queue_url=$(aws sqs create-queue --queue-name $queue_name --output text --query 'QueueUrl')
echo "SQS queue created with URL: $queue_url"

# SNS SQS 구독 연결은 콘솔에서 수동 생성

# Topic Arn 기록
echo "{\"topicArn\": \"$topic_arn\"}" > topic-arn.json
echo "topic-arn.json file created with topicArn: $topic_arn"