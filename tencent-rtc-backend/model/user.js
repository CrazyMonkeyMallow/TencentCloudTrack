const db = require('../database/db');
const bcrypt = require('bcryptjs');

class User {

  static create({ name, email, password, role }) {
    const sql = `
      INSERT INTO users (name, email, password, role, createdAt)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    const result = db.prepare(sql).run(name, email, password, role);
    return { id: result.lastInsertRowid, name, email, role };
  }

  static findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    return db.prepare(sql).get(email) || null;
  }

 
  static findById(id) {
    const sql = `SELECT id, name, email, role FROM users WHERE id = ?`;
    return db.prepare(sql).get(id) || null;
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }


  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;