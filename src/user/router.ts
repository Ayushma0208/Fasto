import express from "express";
import { changePassword, forgotPassword, resetPasswordWithToken, userLogin, userSignup, userUpdate } from "./controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.post('/update', verifyToken, userUpdate)

router.post("/change-password",verifyToken,changePassword)

router.post('/forgot-password', forgotPassword);           

router.post('/reset-password', resetPasswordWithToken); 

export default router;