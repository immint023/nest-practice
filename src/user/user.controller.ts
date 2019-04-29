import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { async } from 'rxjs/internal/scheduler/async';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getList(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDTO): Promise<User[]> {
    return await this.userService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUser: LoginUserDTO): Promise<any> {
    return await this.userService.login(loginUser);
  }
}
