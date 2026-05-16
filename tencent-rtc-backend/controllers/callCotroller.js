const { v4: uuidv4 } = require('uuid');
const Consultation = require('../models/Consultation');

// POST /api/call/initiate
// Called by: Patient
// Receives: symptoms
// Returns: consultationId, roomId
function initiateCall(req, res) {
  try {
    const { symptoms } = req.body;
    const patientId = req.user.id;

    if (!symptoms) {
      return res.status(400).json({ message: 'Please enter symptoms' });
    }

    // Generate a unique room ID
    const roomId = uuidv4();

    const { id } = Consultation.create({ patientId, symptoms, roomId });

    res.status(201).json({ consultationId: id, roomId });
  } catch (err) {
    console.error('initiateCall error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/call/pending
// Called by: Doctor (poll every 3 seconds)
// Returns: list of pending calls [{ id, patientName, symptoms, startedAt }]
function getPendingCalls(req, res) {
  try {
    const calls = Consultation.findPending();
    res.json({ calls });
  } catch (err) {
    console.error('getPendingCalls error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/call/accept
// Called by: Doctor
// Receives: consultationId
// Returns: roomId (for doctor to join the call)
function acceptCall(req, res) {
  try {
    const { consultationId } = req.body;
    const doctorId = req.user.id;

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (consultation.status !== 'pending') {
      return res.status(400).json({
        message: 'This call has already been accepted or ended'
      });
    }

    // Update status to active and assign doctor
    Consultation.updateStatus(consultationId, 'active', { doctorId });

    res.json({ roomId: consultation.roomId });
  } catch (err) {
    console.error('acceptCall error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/call/end
// Called by: Either side when hanging up
// Receives: consultationId, chatLog (array)
// Returns: success message
function endCall(req, res) {
  try {
    const { consultationId, chatLog } = req.body;

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    // Save chat log and mark as ended
    Consultation.saveChatLog(consultationId, chatLog || []);
    Consultation.updateStatus(consultationId, 'ended');

    res.json({ message: 'Call ended successfully' });
  } catch (err) {
    console.error('endCall error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { initiateCall, getPendingCalls, acceptCall, endCall };