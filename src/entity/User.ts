// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {Length, IsEmail, IsOptional, IsPhoneNumber, IsDateString} from "class-validator"; // For validation


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Length(4, 255)
    @IsOptional()
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    googleId: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false  })
    @IsEmail()
    email: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    @IsPhoneNumber()
    @IsOptional()
    mobile: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    firstName: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    lastName: string | null;

    @Column({ type: 'date', nullable: true }) // Optional
    @IsDateString() // Ensures the value is a valid date string
    @IsOptional()
    dateOfBirth: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    profilePicture: string;
}