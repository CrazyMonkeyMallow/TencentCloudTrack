
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { submitNotes, checkNotes } = require('../controllers/notesController');
 
// POST /api/notes/submit    
router.post('/submit', auth, submitNotes);
 
// GET  /api/notes/check/:id   
router.get('/check/:id', auth, checkNotes);
 
module.exports = router;
 