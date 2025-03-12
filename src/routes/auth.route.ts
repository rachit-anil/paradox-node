import express, {response} from 'express';
import {AuthService} from '../services/auth.service';
import bcrypt from 'bcrypt';
import {JsonWebTokenService} from "../services/json-web-token.service";

const JWT_TOKEN_VALIDITY = 2000;
const REFRESH_TOKEN_VALIDITY = 2000000;

export class AuthRoute {
    private router;
    private authService: AuthService;

    constructor() {
        this.router = express.Router();
        this.authService = new AuthService();
        this.router.post('/login', this.login.bind(this));
        this.router.post('/signup', this.signup.bind(this));
        this.router.get('/gallery', this.gallery.bind(this));
        this.router.get('/refreshToken', this.refreshToken.bind(this));
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async refreshToken(req: express.Request, res: express.Response) {
        console.log(process.env.NODE_ENV);
        // await this.delay(300);
        // extract cookies
        const refreshTokenCookie = req.cookies.refreshToken || '';

        if (!refreshTokenCookie) {
            return res.status(401).send('No refresh token found!');
        }

        // validate refresh token cookie - refresh token should be stored in data base ? How should they be stored ?
        const isRefreshTokenVerified = await JsonWebTokenService.verifyToken(refreshTokenCookie);

        // if validated.. generate another jwt and return
        if (isRefreshTokenVerified) {
            const userInfo = JsonWebTokenService.decodeToken(refreshTokenCookie);
            const jwtToken = await JsonWebTokenService.generateToken({name: userInfo.username}, JWT_TOKEN_VALIDITY);  // new access token
            return res.status(200).send({jwtToken});
        } else {
            // if not valid delete cookie from the response
            res.cookie('refreshToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
                sameSite: 'strict', // Or 'Lax' depending on your use case
                maxAge: 1000, // 100 seconds
                path: '/' // Ensure the path is set to root
            });
            return res.status(401).send({message: 'Unauthorized'});
        }
    }

    // secured api
    async gallery(req: express.Request, res: express.Response) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'Access denied. No token provided.'});
        }

        const isVerified = await JsonWebTokenService.verifyToken(token);

        if (!isVerified) {
            return res.status(401).json({message: 'Invalid or expired token.'});
        }

        // If the token is valid, proceed with the secured content
        return res.status(200).json({message: 'Secured gallery content!'});
    }

    async signup(req: express.Request, res: express.Response) {
        const {username, password} = req.body || {};

        if (!username || !password) {
            return res.status(400).json({message: "username, and password are required."});
        }

        const authService = new AuthService();
        const result = await authService.createUser(username, password);

        if (typeof result === "string") {
            return res.status(400).json({message: result});
        }

        return res.status(201).json({message: "User created successfully!", user: result});
    }

    async login(request: express.Request, response: express.Response) {
        const {username, password} = request.body || {};

        try {
            if (!username || !password) {
                return response.status(400).json({error: 'Please enter username or password'});
            }

            const user = await this.authService.findUser(username);

            if (!user) {
                return response.status(404).json({error: 'User could not be found'});
            }

            const isPasswordMatching = await bcrypt.compare(password, user.password);
            // Compare passwords (use bcrypt for hashed passwords)
            if (!isPasswordMatching) {
                return response.status(401).json({error: 'Invalid credentials'});
            }

            // Login successful
            const jwtToken = await JsonWebTokenService.generateToken({name: user.username}, JWT_TOKEN_VALIDITY);
            const refreshToken = await JsonWebTokenService.generateToken({name: user.username}, REFRESH_TOKEN_VALIDITY);

            // secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS

            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Set to true in production for HTTPS
                sameSite: 'strict', // Or 'Lax' depending on your use case
                maxAge: 1000000, // 100 seconds
                path: '/' // Ensure the path is set to root
            });

            response.json({message: 'Login successful', user, jwtToken});
        } catch (error) {
            console.error('Login error:', error);
            response.status(500).json({error: 'Something went wrong'});
        }
    }


    getRouter() {
        return this.router;
    }
}