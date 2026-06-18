import mongoose from 'mongoose';
import { getDbMode, readJsonDb, writeJsonDb } from '../config/db.js';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);

// Find user by email
export const findUserByEmail = async (email) => {
  if (getDbMode() === 'MongoDB') {
    return await UserModel.findOne({ email }).lean();
  } else {
    const db = readJsonDb();
    return db.users.find(u => u.email === email) || null;
  }
};

// Create a new user
export const createUser = async (userData) => {
  if (getDbMode() === 'MongoDB') {
    const newUser = new UserModel({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      createdAt: new Date()
    });
    const saved = await newUser.save();
    return saved.toObject();
  } else {
    const db = readJsonDb();
    const newUser = {
      _id: `user_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeJsonDb(db);
    return newUser;
  }
};
