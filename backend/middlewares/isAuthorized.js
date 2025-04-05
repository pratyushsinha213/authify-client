import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const isAuthorized = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized – No token provided.",
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized – Invalid token.",
                success: false
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in isAuthorized middleware: ${error.message}`,
            success: false
        });
    }
}