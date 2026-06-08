import { Controller, Post, Get,Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { get } from 'http';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.userService.findAllUsers();
  }
}