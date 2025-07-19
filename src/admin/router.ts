import express from 'express';
import { adminLogin, adminSignup, blockUser, getAllUsers } from './controller';
// import { authorizeRoles, verifyToken } from '../middleware/auth';
import { isAdmin } from '../middleware/adminAuth';

const router = express.Router();

router.post("/signup", adminSignup);

router.post("/login", adminLogin);

router.get('/getAllUsers', isAdmin, getAllUsers)

router.post('/block/:id', blockUser)

export default router