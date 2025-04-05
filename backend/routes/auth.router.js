import { Router } from "express";
const authRouter = Router();

import { register, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";

authRouter.get('/check-auth', isAuthorized, checkAuth);

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.post('/verify-email', verifyEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

export default authRouter;