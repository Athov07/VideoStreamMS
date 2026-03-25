import { Router } from "express";
import { checkout, verifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/checkout", verifyJWT, checkout);
router.post("/verify", verifyJWT, verifyPayment);

export default router;