// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length, IsEmail } from "class-validator"; // For validation


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    @Length(4, 255)
    username: string;

    @Column({ type: "varchar", length: 255 }) // Explicitly define the type
    password: string;
}