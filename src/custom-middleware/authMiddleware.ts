import { Request, Response, NextFunction } from 'express';
import {JsonWebTokenService} from "../services/json-web-token.service";

// Middleware to check if user is authenticated
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    // Bypass middleware for the /auth/login route
    if (['/auth/checkJwtValidity','/auth/login','/auth/refreshToken','/auth/signup','/login','/auth/google','/auth/google/callback'].includes(req.path)) {
        return next();
    }

    const token = req.headers.authorization || req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No access token provided.' });
    }

    const isVerified = await JsonWebTokenService.verifyToken(token);

    if (!isVerified) {
        return res.status(401).json({ message: 'Invalid or expired access token.' });
    }

    // If token is verified, allow the request to proceed
    next();
};