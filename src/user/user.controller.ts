import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { UsersService } from './user.service';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { UserVm } from './models/user.model';
import { LoginResultVm } from './models/login-result.model';
import { LoginVm } from './models/login.model';
import { RegisterVm } from './models/register.model';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getList(): Promise<UserVm[]> {
    const user = await this.userService.findAll({
      lean: true,
    });
    return user.map(user => new UserVm(user));
  }

  @Post('login')
  async login(@Body() params: LoginVm): Promise<LoginResultVm> {
    return this.userService.login(params);
  }

  @Post('register')
  async register(@Body() params: RegisterVm): Promise<LoginResultVm> {
    return this.userService.register(params);
  }
}
