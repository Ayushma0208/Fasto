

import { Router } from "express";
import userRoutes from "./user/router.js";
import adminRoutes from "./admin/router.js"

const router = Router();

router.use("/users", userRoutes);

router.use('/admin',adminRoutes)

export default router;