const axios = require('axios').default
const serverless = require("serverless-http");
require('dotenv').config()
const express = require("express");

const app = express();
app.use(express.json());

const {
  connectDb,
  queries: { getLog, recordLog }
} = require('./database')

app.get("/log", connectDb, async (req, res, next) => {
  const result = await req.conn.query(
    getLog()
  )
  await req.conn.end()
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json({ message: "기록 없음" });
  }
}
);

app.post("/log", connectDb, async (req, res, next) => {
  const { requester, quantity, item_id, item_name, factory_id, factory_name } = req.body.payload;
  const callbackUrl = "Delivery 람다 주소"

  console.log("생산 시작합니다.")
  console.log("생산 품목: ", item_id, item_name)
  console.log("생산 공장: ", factory_id, factory_name)
  console.log("생산 수량: ", quantity)
  console.log("생산 요청자: ", requester)
  console.log("생산 완료 후 item db quantity 증가 람다 주소 : ", callbackUrl)

  // DB에 연결해서 Log를 기록하는 코드를 작성하세요.
  // init.sql에서 테이블 구성을 참고하세요.
  // database.js의 recordLog를 참고하세요.
  await req.conn.query(
    recordLog(factory_id, factory_name, item_id, item_name, quantity, requester)
  );

  console.log("데이터베이스에 생산요청 기록 완료");

  //step 3
  try {
    const response = await axios.post(
      //FILL_ME_IN, FILL_ME_IN
      callbackUrl,
      req.body
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  return res.status(200).json({ message_from_factory: `생산 요청 접수!` });
}
);



module.exports.handler = serverless(app);



