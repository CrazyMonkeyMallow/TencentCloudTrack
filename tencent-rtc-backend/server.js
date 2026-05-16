require('dotenv').config(); 
// Load environment variables from the .env file into process.env

const express = require('express'); 
// Import Express framework for building the HTTP server

const cors = require('cors'); 
// Import CORS middleware to allow cross-origin requests (frontend ↔ backend)

const genUserSig = require('./trtc-signature-generator'); 
// Import custom function to generate TRTC (Tencent Real-Time Communication) UserSig

const SDKAPPID = process.env.SDKAPPID; 
// TRTC SDK App ID loaded from environment variables

const SDKSECRETKEY = process.env.SDKSECRETKEY; 
// TRTC SDK secret key used to generate secure UserSig

const app = express(); 
// Create an Express application instance

app.use(cors()); 
// Enable CORS for all routes

app.use(express.json()); 
// Enable parsing of JSON request bodies

// Health check endpoint
// Used to verify that the backend server is running properly
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate TRTC UserSig
// Frontend calls this to obtain a temporary authentication signature
app.get('/usersig', (req, res) => {
  const { userId } = req.query;

  // Generate a UserSig based on SDK credentials and userId
  const userSig = genUserSig({
    SDKAPPID,
    SDKSECRETKEY,
    userId,
    expire: 3600 // Signature validity period in seconds (1 hour)
  });

  res.json({ userSig, userId });
});

// Mount route modules (separate API groups for better structure)
app.use('/api/auth', require('./routes/auth')); 
// Authentication routes (register, login)

app.use('/api/call', require('./routes/call')); 
// Call/consultation related routes (initiate, accept, end call)

app.use('/api/notes', require('./routes/notes')); 
// Doctor notes/medical record submission routes

app.use('/api/history', require('./routes/history')); 
// Consultation history retrieval routes

// Start the server
const PORT = process.env.PORT || 3001; 
// Use environment PORT if available, otherwise default to 3001

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

