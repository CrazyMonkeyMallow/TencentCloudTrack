const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  initiateCall,
  getPendingCalls,
  acceptCall,
  endCall,
  postMessage,
  getMessages
} = require('../controllers/callController');
 
// POST /api/call/initiate 
router.post('/initiate', auth, initiateCall);
 
// GET  /api/call/pending  
router.get('/pending', auth, getPendingCalls);
 
// POST /api/call/accept  
router.post('/accept', auth, acceptCall);
 
// POST /api/call/end     
router.post('/end', auth, endCall);

// POST /api/call/message
router.post('/message', auth, postMessage);

// GET /api/call/messages/:id
router.get('/messages/:id', auth, getMessages);
 
module.exports = router;
