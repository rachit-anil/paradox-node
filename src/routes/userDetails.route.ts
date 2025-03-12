import express from 'express';
import {AuthService} from "../services/auth.service";

export class UserDetailsRoute {
    private router;
    private authService: AuthService;

    constructor() {
        this.router = express.Router();
        this.router.put('/saveUserInfo', this.saveUserInfo.bind(this));
        this.authService = new AuthService();
    }

    async saveUserInfo(req: express.Request, res: express.Response) {
        const user = req.body || {};
        try {
            if (!user.username) {
                return res.status(400).json({error: 'Username missing'});
            }
            const updateResult = await this.authService.updateUser(user);

            if (updateResult.affected === 0) {
                return res.status(404).json({ error: 'User not found' });
            }else{
                res.status(200).json({ message: 'User saved' });
            }

        } catch (error) {
            console.error('Error while saving user:', error);
            res.status(500).json({error});
        }
    }

    getRouter() {
        return this.router;
    }
}