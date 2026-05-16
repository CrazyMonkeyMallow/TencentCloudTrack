const Consultation = require('../models/Consultation');

// POST /api/notes/submit
// Called by: Doctor
// Receives: consultationId, doctorNotes
// Returns: Success message
function submitNotes(req, res) {
  try {
    const { consultationId, doctorNotes } = req.body;

    if (!doctorNotes) {
      return res.status(400).json({ message: 'Doctor notes cannot be empty' });
    }

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (consultation.status !== 'ended') {
      return res.status(400).json({
        message: 'The consultation has not ended yet, so notes cannot be submitted'
      });
    }

    Consultation.submitNotes(consultationId, doctorNotes);

    res.json({ message: 'Doctor notes submitted successfully' });
  } catch (err) {
    console.error('submitNotes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/notes/check/:id
// Called by: Patient (polling after the consultation ends)
// Returns:
//   Notes not ready -> { ready: false }
//   Notes ready     -> { ready: true, chatLog, doctorNotes }
function checkNotes(req, res) {
  try {
    const consultationId = req.params.id;

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (consultation.status !== 'completed') {
      return res.json({ ready: false });
    }

    res.json({
      ready: true,
      chatLog: JSON.parse(consultation.chatLog || '[]'),
      doctorNotes: consultation.doctorNotes
    });
  } catch (err) {
    console.error('checkNotes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { submitNotes, checkNotes };