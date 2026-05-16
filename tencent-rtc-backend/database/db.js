const Database = require('better-sqlite3');
const path = require('path');
 
const db = new Database(path.join(__dirname, 'app.db'));
 
// users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    role      TEXT    NOT NULL CHECK(role IN ('patient', 'doctor')),
    createdAt TEXT    NOT NULL
  )
`);
 
//consultations
db.exec(`
  CREATE TABLE IF NOT EXISTS consultations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId   INTEGER NOT NULL,
    doctorId    INTEGER,
    symptoms    TEXT    NOT NULL,
    roomId      TEXT    NOT NULL,
    chatLog     TEXT,
    doctorNotes TEXT,
    status      TEXT    NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('pending','active','ended','completed')),
    startedAt   TEXT    NOT NULL,
    endedAt     TEXT,
    FOREIGN KEY (patientId) REFERENCES users(id),
    FOREIGN KEY (doctorId)  REFERENCES users(id)
  )
`);
 
module.exports = db;