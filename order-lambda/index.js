const axios = require('axios').default
const consumer = async (event) => {
  for (const record of event.Records) {
    const json = JSON.parse(record.body).MessageAttributes;
    console.log(`도착 데이터 : ${json}`);

    const requester = json.MessageAttributeRequester.Value;
    const quantity = Number(json.MessageAttributeItemCnt.Value);
    const item_id = Number(json.MessageAttributeItemId.Value);
    const factory_id = Number(json.MessageAttributeFactoryId.Value);

    const payload = {
      "requester": requester,
      "quantity": quantity,
      "item_id": item_id,
      "factory_id": factory_id
    }

    try {
      const response = await axios.post(
        `factory lambda api 주소`,
        payload
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = {
  consumer,
};
