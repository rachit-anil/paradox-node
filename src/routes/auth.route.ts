import express from 'express';
import {AuthService} from '../services/auth.service';
import bcrypt from 'bcrypt';

export class AuthRoute {
    private router;
    private authService: AuthService;

    constructor() {
        this.router = express.Router();
        this.authService = new AuthService();
        this.router.post('/login', this.login.bind(this));
        this.router.post('/signup', this.signup.bind(this));
    }

    async signup(req: express.Request, res: express.Response) {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ message: "username, and password are required." });
        }

        const authService = new AuthService();
        const result = await authService.createUser(username, password);

        if (typeof result === "string") {
            return res.status(400).json({ message: result });
        }

        return res.status(201).json({ message: "User created successfully!", user: result });
    }

    async login(request: express.Request, response: express.Response) {
        const { username, password } = request.body || {};

        try {
            const user = await this.authService.findUser(username);

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

           const isPasswordMatching = await bcrypt.compare(password, user.password);
            // Compare passwords (use bcrypt for hashed passwords)
            if (!isPasswordMatching) {
                return response.status(401).json({ error: 'Invalid credentials' });
            }

            // Login successful
            response.json({ message: 'Login successful', user });
        } catch (error) {
            console.error('Login error:', error);
            response.status(500).json({ error: 'Something went wrong' });
        }
    }


    getRouter() {
        return this.router;
    }
}