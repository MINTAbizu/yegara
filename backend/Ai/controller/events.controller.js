import { eventSchema } from("../validator/event.validator");
import { enqueueEvent } from("../services/queue.service");

exports.ingestEvent = async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await enqueueEvent(value);

    res.status(202).json({ status: "queued" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
