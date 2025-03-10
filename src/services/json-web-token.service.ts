import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your-secret-key'; // Store this in environment variables in production

export class JsonWebTokenService {
    // Generate a JWT
    static generateToken(payload, expiresIn = 15) {
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    }


    // Verify a JWT
    static verifyToken(token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7); // Remove "Bearer " prefix
        }

        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err) {
            console.error('Token verification failed:', err.message);
            return null; // Token is invalid or expired
        }
    }

    // Decode a JWT (without verification)
    static decodeToken(token) {
        return jwt.decode(token);
    }

    static secretKey(){return SECRET_KEY}
}