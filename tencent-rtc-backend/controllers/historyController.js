const Consultation = require('../models/Consultation');

// GET /api/history
// Called by: Patient or doctor
// Returns: All consultation records for the currently logged-in user
// (excluding chatLog)
function getHistory(req, res) {
  try {
    const { id, role } = req.user;
    const records = Consultation.findByUser(id, role);
    res.json({ records });
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/history/:id
// Called by: Patient or doctor
// Returns: Full details of a single consultation record
// (including chatLog and doctor recommendations)
function getDetail(req, res) {
  try {
    const consultationId = req.params.id;
    const { id: userId, role } = req.user;

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    // Ensure users can only access their own consultation records
    const isOwner =
      (role === 'patient' && consultation.patientId === userId) ||
      (role === 'doctor' && consultation.doctorId === userId);

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied to this record' });
    }

    res.json({
      ...consultation,
      chatLog: JSON.parse(consultation.chatLog || '[]')
    });
  } catch (err) {
    console.error('getDetail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getHistory, getDetail };