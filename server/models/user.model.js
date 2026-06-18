import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);

// Find user by email
export const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email }).lean();
};

// Create a new user
export const createUser = async (userData) => {
  const newUser = new UserModel({
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    createdAt: new Date()
  });
  const saved = await newUser.save();
  return saved.toObject();
};
