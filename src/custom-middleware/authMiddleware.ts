import { Request, Response, NextFunction } from 'express';
import {JsonWebTokenService} from "../services/json-web-token.service";

// Middleware to check if user is authenticated
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const isVerified = await JsonWebTokenService.verifyToken(token);

    if (!isVerified) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // If token is verified, allow the request to proceed
    next();
};