import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection } from "typeorm";

@Entity()
export class OAuthTokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({  type: 'varchar',unique: true })
    googleId: string; // Google user ID (sub claim)

    @Column({ type: "text", nullable: true })
    accessToken: string;

    @Column({ type: "text", nullable: true })
    refreshToken: string;

    @Column({ type: "datetime", nullable: true })
    accessTokenExpiry: Date; // Store the expiry time
}