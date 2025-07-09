import express from 'express';
import { adminLogin, adminSignup, getAllUsers } from './controller';

const router = express.Router();

router.post("/signup", adminSignup);

router.post("/login", adminLogin);

router.get('/getAllUsers',getAllUsers)
export default router