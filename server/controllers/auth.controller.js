import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP Handler
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields (fullName, email, password)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const savedUser = await createUser({
      fullName,
      email,
      password: hashedPassword
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN Handler
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields (email, password)' });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User does not exist.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
