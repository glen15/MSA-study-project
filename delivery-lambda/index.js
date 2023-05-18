const {
  connectDb,
  queries: { setQuantity }
} = require('./database')


const consumer = async (event) => {
  for (const record of event.Records) {
    const json = JSON.parse(record.body).MessageAttributes;
    console.log(`도착 데이터 : ${JSON.stringify(json)}`);

    const quantity = Number(json.MessageAttributeItemCnt.Value);
    const item_id = Number(json.MessageAttributeItemId.Value);
    console.log(`아이템 id, 수량 : ${item_id}, ${quantity}`);

    connectDb
    const [result] = await req.conn.query(
      setQuantity(item_id, quantity)
    )

    console.log(`결과는 : ${result}`);
    await req.conn.end()
    if (result) {
      return res.status(200).json({ message: "수량 변경 완료", result });
    } else {
      return res.status(400).json({ message: "수량 셋팅 실패" });
    }
  }
};

module.exports = {
  consumer,
};
