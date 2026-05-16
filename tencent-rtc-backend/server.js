const express = require("express");
const cors = require("cors");

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