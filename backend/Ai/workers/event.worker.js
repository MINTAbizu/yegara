const Redis = require("redis");
const mongoose = require("mongoose");
const Event = require("../models/event.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const client = Redis.createClient({
  url: process.env.REDIS_URL,
});

client.connect();

async function processEvents() {
  while (true) {
    const data = await client.brPop("event_queue", 0);

    if (data) {
      const event = JSON.parse(data.element);

      try {
        await Event.create(event);
      } catch (err) {
        console.error("DB write failed:", err);
      }
    }
  }
}

processEvents();
