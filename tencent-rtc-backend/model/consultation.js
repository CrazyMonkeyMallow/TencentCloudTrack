const db = require('../database/db');

class Consultation {

  static create({ patientId, symptoms, roomId }) {
    const sql = `
      INSERT INTO consultations (patientId, symptoms, roomId, status, startedAt)
      VALUES (?, ?, ?, 'pending', datetime('now'))
    `;
    const result = db.prepare(sql).run(patientId, symptoms, roomId);
    return { id: result.lastInsertRowid };
  }

  static findPending() {
    const sql = `
      SELECT
        c.id,
        c.symptoms,
        c.startedAt,
        u.name AS patientName
      FROM consultations c
      JOIN users u ON c.patientId = u.id
      WHERE c.status = 'pending'
      ORDER BY c.startedAt ASC
    `;
    return db.prepare(sql).all();
  }

  static findLatestForPatient(patientId) {
    const sql = `
      SELECT
        c.*,
        p.name AS patientName,
        d.name AS doctorName
      FROM consultations c
      JOIN users p ON c.patientId = p.id
      LEFT JOIN users d ON c.doctorId = d.id
      WHERE c.patientId = ?
        AND c.status IN ('pending', 'active', 'ended', 'completed')
      ORDER BY c.startedAt DESC
      LIMIT 1
    `;
    return db.prepare(sql).get(patientId) || null;
  }


  static findById(id) {
    const sql = `
      SELECT
        c.*,
        p.name AS patientName,
        d.name AS doctorName
      FROM consultations c
      JOIN users p ON c.patientId = p.id
      LEFT JOIN users d ON c.doctorId = d.id
      WHERE c.id = ?
    `;
    return db.prepare(sql).get(id) || null;
  }


  static updateStatus(id, status, options = {}) {
    if (options.doctorId) {
      const sql = `UPDATE consultations SET status = ?, doctorId = ? WHERE id = ?`;
      db.prepare(sql).run(status, options.doctorId, id);
    } else {
      const sql = `UPDATE consultations SET status = ? WHERE id = ?`;
      db.prepare(sql).run(status, id);
    }
  }

  static end(id) {
    const sql = `
      UPDATE consultations
      SET status = 'ended', endedAt = COALESCE(endedAt, datetime('now'))
      WHERE id = ? AND status IN ('pending', 'active')
    `;
    db.prepare(sql).run(id);
  }

  

  static saveChatLog(id, chatLog) {
    const existing = this.getChatLog(id);
    const seen = new Set(existing.map((message) => `${message.sender}-${message.time}-${message.text}`));
    const merged = [...existing];

    (Array.isArray(chatLog) ? chatLog : []).forEach((message) => {
      const key = `${message.sender}-${message.time}-${message.text}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(message);
      }
    });

    const sql = `
      UPDATE consultations
      SET chatLog = ?, endedAt = COALESCE(endedAt, datetime('now'))
      WHERE id = ?
    `;
    db.prepare(sql).run(JSON.stringify(merged), id);
  }

  static getChatLog(id) {
    const row = db.prepare(`SELECT chatLog FROM consultations WHERE id = ?`).get(id);
    if (!row || !row.chatLog) return [];

    try {
      const parsed = JSON.parse(row.chatLog);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  static appendChatMessage(id, message) {
    const chatLog = this.getChatLog(id);
    chatLog.push(message);
    db.prepare(`UPDATE consultations SET chatLog = ? WHERE id = ?`).run(JSON.stringify(chatLog), id);
    return chatLog;
  }

  
  static submitNotes(id, doctorNotes) {
    const sql = `
      UPDATE consultations
      SET doctorNotes = ?, status = 'completed'
      WHERE id = ?
    `;
    db.prepare(sql).run(doctorNotes, id);
  }


  static findByUser(userId, role) {
    let sql;

    if (role === 'patient') {
      sql = `
        SELECT
          c.id,
          c.symptoms,
          c.status,
          c.startedAt,
          c.endedAt,
          u.name AS doctorName
        FROM consultations c
        LEFT JOIN users u ON c.doctorId = u.id
        WHERE c.patientId = ?
        ORDER BY c.startedAt DESC
      `;
    } else {
      sql = `
        SELECT
          c.id,
          c.symptoms,
          c.status,
          c.startedAt,
          c.endedAt,
          u.name AS patientName
        FROM consultations c
        JOIN users u ON c.patientId = u.id
        WHERE c.doctorId = ?
        ORDER BY c.startedAt DESC
      `;
    }

    return db.prepare(sql).all(userId);
  }
}

module.exports = Consultation;
