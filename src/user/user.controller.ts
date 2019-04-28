import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getList(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User[]> {
    return await this.userService.create(createUserDto);
  }
}
