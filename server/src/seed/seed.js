import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Subject } from '../models/Subject.js';
import { Mark } from '../models/Mark.js';
import { calculateGrade } from '../utils/gradeCalculator.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_dashboard';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Mark.deleteMany({});
    console.log('Cleared existing database records.');

    // 1. Create Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Created Admin user.');

    // 2. Create Subjects (3 clean subjects)
    const subjects = await Subject.insertMany([
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Science', code: 'SCI101' },
      { name: 'English', code: 'ENG101' },
    ]);
    console.log(`Created ${subjects.length} subjects.`);

    // 3. Create 5 Students
    const students = await Student.insertMany([
      {
        name: 'Thushani Malsha',
        indexNo: 'STU1001',
        className: 'Grade 10-A',
        email: 'Thushani@gmail.com',
        phone: '070-3224333',
      },
      {
        name: 'Ashani Malsha',
        indexNo: 'STU1002',
        className: 'Grade 10-A',
        email: 'Ashani@gmail.com',
        phone: '070-3224337',
      },
      {
        name: 'Lahiru Madushanka',
        indexNo: 'STU1003',
        className: 'Grade 10-B',
        email: 'Lahiru@gmail.com',
        phone: '070-3224336',
      },
      {
        name: 'Kavindu Bathiya',
        indexNo: 'STU1004',
        className: 'Grade 10-B',
        email: 'Kavindu@gamil.com',
        phone: '070-3224332',
      },
      {
        name: 'Avindya Lanka',
        indexNo: 'STU1005',
        className: 'Grade 11-A',
        email: 'Avindya@sgamil.com',
        phone: '070-3224331',
      },
    ]);
    console.log(`Created ${students.length} students.`);

    // 4. Create 5 clean Mark records
    const markRecords = [
      {
        student: students[0]._id, 
        subject: subjects[0]._id, 
        term: 'Term 1',
        marks: 85,
        grade: calculateGrade(85),
      },
      {
        student: students[1]._id, 
        subject: subjects[0]._id, 
        term: 'Term 1',
        marks: 92,
        grade: calculateGrade(92),
      },
      {
        student: students[2]._id, 
        subject: subjects[1]._id, 
        term: 'Term 1',
        marks: 68,
        grade: calculateGrade(68),
      },
      {
        student: students[3]._id, 
        subject: subjects[2]._id, 
        term: 'Term 1',
        marks: 54,
        grade: calculateGrade(54),
      },
      {
        student: students[4]._id, 
        subject: subjects[0]._id, 
        term: 'Term 1',
        marks: 32,
        grade: calculateGrade(32),
      },
    ];

    await Mark.insertMany(markRecords);
    console.log(`Created ${markRecords.length} mark records.`);


    console.log('Database Seeding Completed Successfully! (5 Records)');
    console.log('Admin Credentials for Login:');
    console.log('  Email:    admin@example.com');
    console.log('  Password: Admin@123');
  

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
