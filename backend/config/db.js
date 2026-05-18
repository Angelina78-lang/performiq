import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/epars.db');

let db;

export const connectDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`❌ Database connection error: ${err.message}`);
        reject(err);
        process.exit(1);
      }

      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error(`❌ Failed to enable foreign keys: ${err.message}`);
          reject(err);
          return;
        }

        // Create tables
        db.serialize(() => {
          db.exec(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              role TEXT DEFAULT 'admin',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS employees (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              department TEXT NOT NULL,
              skills TEXT DEFAULT '[]',
              performance_score INTEGER NOT NULL,
              experience INTEGER NOT NULL,
              ai_insights TEXT DEFAULT '{}',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
            CREATE INDEX IF NOT EXISTS idx_employees_performance ON employees(performance_score);
            CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
          `, (err) => {
            if (err) {
              console.error(`❌ Table creation error: ${err.message}`);
              reject(err);
            } else {
              console.log('✅ SQLite database connected: ' + dbPath);
              resolve(db);
            }
          });
        });
      });
    });
  });
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
};

// Promisified database methods for easier use
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const dbExec = (sql) => {
  return new Promise((resolve, reject) => {
    getDB().exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export default connectDB;
