import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Post('/signup')
    createUser(@Body() { email, password }: CreateUserDto) {
        return this.usersService.create(email, password);
    }
}
