const axios = require('axios').default
const consumer = async (event) => {
  for (const record of event.Records) {
    const json = JSON.parse(record.body).MessageAttributes
    console.log(json);
    // const payload = {
    //   "MessageGroupId": "stock-arrival-group",
    //   "MessageAttributeProductId": json.MessageAttributeProductId.Value,
    //   "MessageAttributeProductCnt": json.MessageAttributeProductCnt.Value,
    //   "MessageAttributeFactory_identifier": json.MessageAttributeFactoryId.Value,
    //   "MessageAttributeRequester": json.MessageAttributeRequester.Value,
    //   "CallbackUrl": "https://9ckxfwlrda.execute-api.ap-northeast-2.amazonaws.com/product/donut"
    // }

    // try {
    //   const response = await axios.post(
    //     `http://project3-factory.coz-devops.click/api/manufactures`,
    //     payload
    //   );
    //   console.log(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  }
};

module.exports = {
  consumer,
};
