import { AppDataSource } from "../sql-data-source";
import { User } from "../entity/User";
import {validate} from "class-validator";
import bcrypt from "bcrypt";

export class AuthService {
    userRepository = AppDataSource.getRepository(User);


    async findUser(username: string) {
        try {
            const user = await this.userRepository.findOne({ where: { username } });
            return user || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    async createUser(username: string, password: string): Promise<User | string> {
        // Validate input
        const user = new User();
        user.username = username;
        user.password = password;

        const errors = await validate(user);
        if (errors.length > 0) {
            return errors.map((error) => Object.values(error.constraints)).join(", ");
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: [{ username }],
        });

        if (existingUser) {
            return "Username or email already exists.";
        }

        // Hash the password
        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);

        // Save the user to the database
        await this.userRepository.save(user);
        return user;
    }
}