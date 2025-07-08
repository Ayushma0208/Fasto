import express from "express";
import { userLogin, userSignup, userUpdate } from "./controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.post('/update', verifyToken, userUpdate)

export default router;