const Consultation = require('../model/consultation');

function generateRoomId() {
  return String(100000 + Math.floor(Math.random() * 900000));
}

// POST /api/call/initiate
// Called by: Patient
// Receives: symptoms
// Returns: consultationId, roomId
function initiateCall(req, res) {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can initiate calls' });
    }

    const { symptoms } = req.body;
    const patientId = req.user.id;

    if (!symptoms) {
      return res.status(400).json({ message: 'Please enter symptoms' });
    }

    // Generate a unique room ID
    const roomId = generateRoomId();

    const { id } = Consultation.create({ patientId, symptoms, roomId });

    res.status(201).json({ consultationId: id, roomId });
  } catch (err) {
    console.error('initiateCall error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/call/pending
// Called by: Doctor or patient (poll every 3 seconds)
// Doctor returns: list of pending calls [{ id, patientName, symptoms, startedAt }]
// Patient returns: latest consultation status so the waiting screen can advance.
function getPendingCalls(req, res) {
  try {
    if (req.user.role === 'patient') {
      const call = Consultation.findLatestForPatient(req.user.id);
      if (!call) {
        return res.json({ call: null });
      }

      return res.json({
        call: {
          id: call.id,
          consultationId: call.id,
          roomId: call.roomId,
          symptoms: call.symptoms,
          status: call.status,
          doctorName: call.doctorName,
          startedAt: call.startedAt,
          endedAt: call.endedAt
        }
      });
    }

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
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can accept calls' });
    }

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

    if (!isParticipant(consultation, req.user.id)) {
      return res.status(403).json({ message: 'Access denied to this consultation' });
    }

    // Save chat log and mark as ended
    Consultation.saveChatLog(consultationId, chatLog || []);
    Consultation.end(consultationId);

    res.json({ message: 'Call ended successfully' });
  } catch (err) {
    console.error('endCall error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

function isParticipant(consultation, userId) {
  return consultation.patientId === userId || consultation.doctorId === userId;
}

// POST /api/call/message
// Called by: Either side during a consultation
// Receives: consultationId, text, sender
function postMessage(req, res) {
  try {
    const { consultationId, text, sender } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (!isParticipant(consultation, req.user.id)) {
      return res.status(403).json({ message: 'Access denied to this consultation' });
    }

    const message = {
      sender: sender === 'doctor' ? 'doctor' : 'patient',
      text: String(text).trim(),
      time: Date.now()
    };

    Consultation.appendChatMessage(consultationId, message);

    res.status(201).json({ message });
  } catch (err) {
    console.error('postMessage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/call/messages/:id
// Called by: Either side while polling chat
function getMessages(req, res) {
  try {
    const consultationId = req.params.id;
    const consultation = Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (!isParticipant(consultation, req.user.id)) {
      return res.status(403).json({ message: 'Access denied to this consultation' });
    }

    res.json({ messages: Consultation.getChatLog(consultationId) });
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  initiateCall,
  getPendingCalls,
  acceptCall,
  endCall,
  postMessage,
  getMessages
};
