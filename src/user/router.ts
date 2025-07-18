import express from "express";
import { changePassword, userLogin, userSignup, userUpdate } from "./controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.post('/update', verifyToken, userUpdate)

router.post("/change-password",verifyToken,changePassword)

export default router;