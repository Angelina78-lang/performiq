import dotenv from 'dotenv';
import { connectDB, dbExec } from '../config/db.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

dotenv.config();

// 8 realistic sample employees across multiple departments.
const sampleEmployees = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@company.com',
    department: 'Development',
    skills: ['Node.js', 'React', 'MongoDB', 'Express'],
    performanceScore: 92,
    experience: 5,
  },
  {
    name: 'Priya Mehta',
    email: 'priya.mehta@company.com',
    department: 'AI/ML',
    skills: ['Python', 'ML', 'SQL', 'TensorFlow'],
    performanceScore: 88,
    experience: 4,
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@company.com',
    department: 'Development',
    skills: ['React', 'JavaScript'],
    performanceScore: 74,
    experience: 2,
  },
  {
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@company.com',
    department: 'HR',
    skills: ['Communication', 'Recruitment Tools'],
    performanceScore: 81,
    experience: 6,
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@company.com',
    department: 'Sales',
    skills: ['Negotiation', 'CRM', 'Communication'],
    performanceScore: 63,
    experience: 3,
  },
  {
    name: 'Anjali Nair',
    email: 'anjali.nair@company.com',
    department: 'Support',
    skills: ['Customer Service'],
    performanceScore: 47,
    experience: 1,
  },
  {
    name: 'Karan Joshi',
    email: 'karan.joshi@company.com',
    department: 'AI/ML',
    skills: ['Python', 'Data Analysis'],
    performanceScore: 69,
    experience: 2,
  },
  {
    name: 'Divya Reddy',
    email: 'divya.reddy@company.com',
    department: 'Development',
    skills: ['Node.js', 'React', 'MongoDB', 'Docker', 'AWS'],
    performanceScore: 95,
    experience: 7,
  },
];

const demoUser = {
  name: 'Demo Admin',
  email: 'admin@company.com',
  password: 'admin123',
  role: 'admin',
};

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await dbExec('DELETE FROM employees; DELETE FROM users;');
    console.log('🗑️  Cleared existing employees and users');

    // Insert employees
    for (const emp of sampleEmployees) {
      await Employee.create(emp);
    }
    console.log(`✅ Inserted ${sampleEmployees.length} sample employees`);

    // Create demo user
    await User.create(demoUser);
    console.log('✅ Created demo admin user');
    console.log('   ➜ Email: admin@company.com');
    console.log('   ➜ Password: admin123');

    console.log('\n🌱 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seed();
