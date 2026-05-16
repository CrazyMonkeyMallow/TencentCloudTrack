const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getHistory, getDetail } = require('../controllers/historyController');

// GET /api/history     
router.get('/', auth, getHistory);

// GET /api/history/:id  
router.get('/:id', auth, getDetail);

module.exports = router;