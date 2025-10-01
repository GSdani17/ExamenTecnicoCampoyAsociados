import express from "express";
import { login } from "../controller/LoginController";
import { verifyToken } from "../middleware/authenticateJWT";

const router = express.Router();

router.post("/", login); 


export default router;