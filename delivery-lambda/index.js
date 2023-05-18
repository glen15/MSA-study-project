const mysql = require('mysql2/promise');
require('dotenv').config()

const {
  HOSTNAME: host,
  USERNAME: user,
  PASSWORD: password,
  DATABASE: database
} = process.env;

const consumer = async (event) => {
  for (const record of event.Records) {
    const json = JSON.parse(record.body).MessageAttributes;
    console.log(`도착 데이터 : ${JSON.stringify(json)}`);

    const quantity = Number(json.MessageAttributeItemCnt.Value);
    const item_id = Number(json.MessageAttributeItemId.Value);
    console.log(`아이템 id, 수량 : ${item_id}, ${quantity}`);
    try {
      const connect = await mysql.createConnection({ host, user, password, database });
      const result = connect.query(`UPDATE items SET quantity = ${quantity} WHERE item_id = ${item_id};`);
      console.log(`데이터베이스 쿼리 결과 : ${result}`);
    } catch (e) {
      console.log(`데이터보에스 연결 오류 : ${e}`);
    }
  }
};

module.exports = {
  consumer,
};
