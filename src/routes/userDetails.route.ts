import express from 'express';
import {AuthService} from "../services/auth.service";
import {JsonWebTokenService} from "../services/json-web-token.service";
import bcrypt from "bcrypt";

export class UserDetailsRoute {
    private router;
    private authService: AuthService;

    constructor() {
        this.router = express.Router();
        this.router.put('/saveUserInfo', this.saveUserInfo.bind(this));
        this.router.get('/getUser', this.getUser.bind(this));
        this.authService = new AuthService();
    }

    async getUser(req: express.Request, res: express.Response) {
        const jwtToken = (req.cookies || {}).jwtToken;
        // taken care by custom jwt middle ware
        // if(!jwtToken){
        //     res.status(401).send({message: "JWT token not found"});
        // }
        // const isJwtVerified = await JsonWebTokenService.verifyToken(jwtToken);
        // if(!isJwtVerified){
        //     return res.status(401).send({message: "JWT token could not be verified"});
        // }
        try {
            const userInfo = JsonWebTokenService.decodeToken(jwtToken);
            const user = await this.authService.findUser(userInfo.email);
            if (user) {
                console.log(user);
                res.status(200).json({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    mobile: user.mobile,
                });
            }

        }catch (e) {
            console.error('Error while fetching user:', e);
            res.status(500).json({e});
        }
    }

    async saveUserInfo(req: express.Request, res: express.Response) {
        const user = req.body || {};
        try {
            if (!user.email) {
                return res.status(400).json({error: 'Email missing'});
            }

            if(user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }else{
                delete user.password;
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