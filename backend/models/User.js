import bcrypt from 'bcryptjs';
import { dbRun, dbGet } from '../config/db.js';

export class User {
  static async findByEmail(email) {
    return dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
  }

  static async findById(id) {
    return dbGet('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async create(data) {
    const { name, email, password, role = 'admin' } = data;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const result = await dbRun(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email.toLowerCase(), hashedPassword, role]
      );
      return this.findById(result.lastID);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('A user with this email already exists');
      }
      throw error;
    }
  }

  static async matchPassword(user, enteredPassword) {
    return bcrypt.compare(enteredPassword, user.password);
  }
}

export default User;
