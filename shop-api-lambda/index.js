const serverless = require("serverless-http");

require('dotenv').config()

const express = require("express");
const app = express();
app.use(express.json())

const AWS = require("aws-sdk")
const sns = new AWS.SNS({ region: "ap-northeast-2" })


const {
  connectDb,
  queries: { getItems, getOneItem, setQuantity }
} = require('./database')

app.get("/item", connectDb, async (req, res, next) => {
  const [result] = await req.conn.query(
    getItems()
  )
  await req.conn.end()
  if (result.length > 0) {
    return res.status(200).json(result[0]);
  } else {
    return res.status(400).json({ message: "상품 없음" });
  }
});

app.post("/item", connectDb, async (req, res, next) => {
  const [result] = await req.conn.query(
    getOneItem(req.body.item_name)
  )
  console.log(`확인한 아이템 정보 : ${result}`);
  if (result.length > 0) {
    const item = result[0]
    console.log(`수량확인 : ${typeof req.body.quentity}, ${req.body.quentity}`);
    console.log(item.quentity > 0 && item.quentity > req.body.quentity)
    if (item.quentity > 0 && item.quentity > req.body.quentity) {
      await req.conn.query(setStock(item.id, item.quentity - 1))
      return res.status(200).json({ message: `구매 완료! 남은 재고: ${item.quentity - 1}` });
    }
    else {
      await req.conn.end()
      const now = new Date().toString()
      const message = `${item.name} 재고가 부족합니다. 제품을 생산해주세요! \n메시지 작성 시각: ${now}`
      const params = {
        Message: message,
        Subject: `${item.name} 재고 부족`,
        MessageAttributes: {
          MessageAttributeProductId: {
            StringValue: item.id,
            DataType: "Number",
          },
          MessageAttributeFactoryId: {
            StringValue: item.factory_id,
            DataType: "Number",
          },
          MessageAttributeProductCnt: {
            StringValue: req.body.quentity,
            DataType: "Number",
          },
          MessageAttributeRequester: {
            StringValue: req.body.requester,
            DataType: "String",
          }
        },

        TopicArn: process.env.TOPIC_ARN
      }
      console.log("보내는 메시지 결과물  : ", params)
      await sns.publish(params).promise()
      return res.status(200).json({ message: `구매 실패! 남은 재고: ${item.quentity}, 생산요청 진행중` });
    }
  } else {
    await req.conn.end()
    return res.status(400).json({ message: "상품 없음" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
module.exports.app = app;
