import express from "express";
import { getUser, register, login, logout } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();


router.get('/users',verifyToken,getUser);
router.post('/login',login);
router.post('/register',register);
router.delete('/logout', logout)

export default router

