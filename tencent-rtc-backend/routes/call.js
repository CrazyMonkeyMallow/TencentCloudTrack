const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { initiateCall, getPendingCalls, acceptCall, endCall } = require('../controllers/callController');
 
// POST /api/call/initiate 
router.post('/initiate', auth, initiateCall);
 
// GET  /api/call/pending  
router.get('/pending', auth, getPendingCalls);
 
// POST /api/call/accept  
router.post('/accept', auth, acceptCall);
 
// POST /api/call/end     
router.post('/end', auth, endCall);
 
module.exports = router;