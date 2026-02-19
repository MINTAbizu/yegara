import express from("express");
const router = express.Router();
import { ingestEvent } from("../controllers/events.controller");

router.post("/", ingestEvent);

module.exports = router;
