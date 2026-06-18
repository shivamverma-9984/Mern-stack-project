import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const router = express.Router();

// SIGNUP Endpoint
router.post('/signup', signup);

// LOGIN Endpoint
router.post('/login', login);

export default router;
