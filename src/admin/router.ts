import express from 'express';
import { adminLogin, adminSignup, getAllUsers } from './controller';
import { authorizeRoles, verifyToken } from '../middleware/auth';

const router = express.Router();

router.post("/signup", adminSignup);

router.post("/login", adminLogin);

router.get('/getAllUsers', verifyToken, getAllUsers)

export default router