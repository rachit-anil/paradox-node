import {AppDataSource} from "../sql-data-source";
import {User} from "../entity/User";
import {validate} from "class-validator";
import bcrypt from "bcrypt";

export class AuthService {
    userRepository = AppDataSource.getRepository(User);

    async updateUser(user: any) {
        try {
            const result = await this.userRepository.update({email: user.email}, user);
            return result;
        } catch (error) {
            throw error; // Re-throw the error to handle it in the calling function
        }
    }

    async findUser(email: string) {
        try {
            const user = await this.userRepository.findOne({where: {email}});
            return user || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    async createUser(email: string, password: string): Promise<User | string> {
        // Validate input
        const user = new User();
        user.email = email;
        user.password = password;

        const errors = await validate(user);
        if (errors.length > 0) {
            return errors.map((error) => Object.values(error.constraints)).join(", ");
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: [{email}],
        });

        if (existingUser) {
            return "Email already exists.";
        }

        // Hash the password
        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);

        // Save the user to the database
        await this.userRepository.save(user);
        return user;
    }

    async saveGoogleAuthUser(userInfo: any, userId?: number): Promise<User | string> {
        try{
            // Validate input
            const user = new User();
            user.email = userInfo.email;
            user.firstName = userInfo.firstName;
            user.lastName = userInfo.lastName;
            user.googleId = userInfo.googleId;
            user.profilePicture = userInfo.profilePicture;

            // check if username is unique
            let userWithSameUsername = await this.userRepository.find({where: {username: userInfo.username}});
            if(!userWithSameUsername.length){
                user.username = userInfo.username;
            }

            const errors = await validate(user);
            if (errors.length > 0) {
                return errors.map((error) => Object.values(error.constraints)).join(", ");
            }

            // Save the user to the database
            if(userId){
                await this.userRepository.update(userId, user);
            }else{
                return await this.userRepository.save(user);
            }
        }catch (error) {
            console.error('Error saving Google User:', error);
            throw error;
        }
    }

}