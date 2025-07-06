import express from 'express';
import { adminSignup } from './controller';

const router = express.Router();

router.post("/signup", adminSignup);
// router.post("/login", userLogin);

export default router