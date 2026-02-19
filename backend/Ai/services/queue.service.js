import  Redis from("redis");

const client = Redis.createClient({
  url: process.env.REDIS_URL,
});

client.connect();

exports.enqueueEvent = async (event) => {
  await client.lPush("event_queue", JSON.stringify(event));
};
