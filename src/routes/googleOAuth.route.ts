import express from 'express';
import {OAuth2Client} from "google-auth-library";
import {AuthService} from "../services/auth.service";
import {OAuthTokenService} from "../services/oauthtoken.service";
import {JsonWebTokenService} from "../services/json-web-token.service";
import {JWT_TOKEN_VALIDITY, REFRESH_TOKEN_VALIDITY} from '../constants/app.constants';

export class GoogleOAuthRoute {
    private router;
    oAuthTokenService = new OAuthTokenService();
    authService = new AuthService();

    client = new OAuth2Client({
        clientId : process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectUri: process.env.NODE_ENV === 'production' ? 'https://projectparadox.in/auth/google/callback' : 'http://localhost:8080/auth/google/callback',
    });

    constructor() {
        this.router = express.Router();
        this.router.get('/', this.initiateGoogleOAuth.bind(this));
        this.router.get('/callback', this.googleAuthCallback.bind(this));
    }

    async initiateGoogleOAuth(req: express.Request, res: express.Response) {
        const url = this.client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        });
        res.redirect(url);
    }

    async googleAuthCallback(req: express.Request, res: express.Response) {
        const { code } = req.query;
        // implement error codes
        try {
            // Exchange the authorization code for tokens
            const { tokens } = await this.client.getToken(code as string);
            const { access_token, refresh_token, id_token } = tokens;
            const userInfo = await this.verifyAndDecodeIdToken(id_token);
            const tokenInfo = {
                accessToken: access_token,
                refreshToken: refresh_token,
                googleId: userInfo.googleId,
            };

            // save Google Oauth token in DB so that they are never exposed to client
            let oauthToken = await this.oAuthTokenService.updateTokens(tokenInfo);

            // find if the user is already registered with same email id
            const user = await this.authService.findUser(userInfo.email);
            const username = user?.username || userInfo.email?.split('@')[0];
            if(!user){
                // create Google user - in User Table -
                await this.authService.saveGoogleAuthUser({...userInfo,username});
            }else{
                // update Google user - in User Table -
                const updatedUser = {
                    firstName: user.firstName || userInfo.firstName,
                    lastName: user.lastName || userInfo.lastName,
                    mobile: user.mobile,
                    email: user.email,
                    googleId: userInfo.googleId,
                    profilePicture: user.profilePicture || userInfo.profilePicture,
                    username,
                };
                console.log('updatedUser');
                console.log(updatedUser);
                await this.authService.saveGoogleAuthUser(updatedUser, user.id);
            }


            // Create JWT so that user is always validated through this node server
            // Return jwt and refresh token through the cookies
            const jwtToken = JsonWebTokenService.generateToken({email: userInfo.email}, JWT_TOKEN_VALIDITY);
            const refreshToken = await JsonWebTokenService.generateToken({email: userInfo.email}, REFRESH_TOKEN_VALIDITY);

            res.cookie('jwtToken', jwtToken, {
                httpOnly: false,
                secure: false, // Set to true in production for HTTPS
                sameSite: 'strict', // Or 'Lax' depending on your use case
                maxAge: JWT_TOKEN_VALIDITY, //
                path: '/' // Ensure the path is set to root
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Set to true in production for HTTPS
                sameSite: 'strict', // Or 'Lax' depending on your use case
                maxAge: REFRESH_TOKEN_VALIDITY, //
                path: '/' // Ensure the path is set to root
            });

            if(process.env.NODE_ENV === 'production') {
                res.redirect('/login');
            }else{
                res.redirect('http://localhost:4200/login');
            }
            // Respond with the user profile and tokens
            // res.json({ success: true, profile, tokens });
        } catch (error){
            console.error('Error during OAuth callback:', error);
            res.status(500).json({ success: false, message: 'Authentication failed' });
        }
    }

    async verifyAndDecodeIdToken(idToken) {
        const client = new OAuth2Client();
        const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID; // Replace with your client ID

        try {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: CLIENT_ID, // Specify your client ID
            });
            const payload = ticket.getPayload();
            console.log(payload);
            const googleId = payload['sub']; // 'sub' claim provides the user's ID
            const email = payload['email'];
            const firstName = payload['given_name'];
            const lastName = payload['family_name'];
            const picture = payload['picture'];

            // You can access other claims from the payload as needed
            return {
                googleId,
                firstName,
                lastName,
                email: email,
                profilePicture: picture,
            };
        } catch (error) {
            console.error('Error verifying ID token:', error);
            return null;
        }
    }

    getRouter() {
        return this.router;
    }
}