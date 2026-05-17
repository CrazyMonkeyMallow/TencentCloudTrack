const Consultation = require('../model/consultation');

// POST /api/notes/submit
// Called by: Doctor
// Receives: consultationId, doctorNotes
// Returns: Success message
function submitNotes(req, res) {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can submit notes' });
    }

    const { consultationId, doctorNotes, diagnosis, medicationAdvice, precautions } = req.body;
    const notes =
      doctorNotes ||
      {
        diagnosis: (diagnosis || '').trim(),
        medicationAdvice: (medicationAdvice || '').trim(),
        precautions: (precautions || '').trim()
      };

    const hasNotes =
      typeof notes === 'string'
        ? notes.trim()
        : notes.diagnosis || notes.medicationAdvice || notes.precautions;

    if (!hasNotes) {
      return res.status(400).json({ message: 'Doctor notes cannot be empty' });
    }

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (consultation.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this consultation' });
    }

    if (consultation.status !== 'ended') {
      return res.status(400).json({
        message: 'The consultation has not ended yet, so notes cannot be submitted'
      });
    }

    Consultation.submitNotes(
      consultationId,
      typeof notes === 'string' ? notes.trim() : JSON.stringify(notes)
    );

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

    const isParticipant =
      consultation.patientId === req.user.id || consultation.doctorId === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied to this consultation' });
    }

    if (consultation.status !== 'completed') {
      return res.json({ ready: false });
    }

    let doctorNotes = consultation.doctorNotes;
    try {
      doctorNotes = JSON.parse(consultation.doctorNotes);
    } catch (_) {}

    res.json({
      ready: true,
      chatLog: JSON.parse(consultation.chatLog || '[]'),
      doctorNotes
    });
  } catch (err) {
    console.error('checkNotes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { submitNotes, checkNotes };
