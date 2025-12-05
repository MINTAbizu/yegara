
import React, { useState } from "react";
import axios from "axios";

const Telegram = () => {
  const [telegramUsername, setTelegramUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [chatId, setChatId] = useState("");
  const [status, setStatus] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000);

  const sendCode = async () => {
    try {
      const code = generateCode();
      const res = await axios.post("http://localhost:5000/telegram/send-code", {
        telegramUsername,
        code,
      });
      setStatus(res.data.message);
      setCodeSent(true);
    } catch (err) {
      setStatus(err.response?.data?.message || "Could not send code.");
      setCodeSent(false);
    }
  };

  const verifyOwner = async () => {
    try {
      const res = await axios.post("http://localhost:5000/telegram/verify-owner", {
        inviteLink,
        sellerTelegramUsername: telegramUsername,
        chatId, // user must provide chatId
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus(err.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-4 text-center fw-bold">Private Group Verification</h3>

        <div className="mb-3">
          <label className="form-label">Your Telegram Username</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter Telegram username (without @)"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={sendCode}>
            1. Send Verification Code
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Private Group Invite Link</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter group invite link"
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Chat ID (after adding bot to group)</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter group chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={verifyOwner} disabled={!codeSent}>
            2. Verify Ownership
          </button>
        </div>

        <p className="text-center mt-3 fw-semibold text-primary">{status}</p>
        <p className="text-center text-muted">
          ⚠️ Make sure the bot is added to your private group and is an admin.
        </p>
      </div>
    </div>
  );
};

export default Telegram;
