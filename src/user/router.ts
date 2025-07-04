import express from "express";
import { userLogin, userSignup } from "./controller";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);

export default router;