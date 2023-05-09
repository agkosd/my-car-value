import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signUp(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('Email already in use. Please use a different email id')
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32));
        const result = salt + '.' + hash;

        return await this.usersService.create(email, result);
    }

    async signIn(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('No user found with this email. Please Sign Up!');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Wrong Password')
        }

        return user;
    }
}