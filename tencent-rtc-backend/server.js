const express = require("express");
const cors = require("cors");
require('dotenv').config();
const SDKAPPID = process.env.SDKAPPID;
const SDKSECRETKEY = process.env.SDKSECRETKEY;

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// MOCK userSig
app.get("/usersig", (req, res) => {
  res.json({
    userSig: "MOCK_SIG",
    userId: "testUser"
  });
});


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

const genUserSig = require('./trtc-signature-generator');


app.get("/usersig", (req, res) => {
  const { userId } = req.query;

  const userSig = genUserSig({
    SDKAPPID,
    SDKSECRETKEY,
    userId,
    expire: 3600
  });

  res.json({
    userSig,
    userId
  });
});