import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserVm } from './models/user.model';
import { LoginResultVm } from './models/login-result.model';
import { RegisterVm } from './models/register.model';
import { LoginVm } from './models/login.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserVm[]> {
    const users = await this.userService.findAll();
    return users.map(user => new UserVm(user));
  }

  @Post('login')
  async login(@Body() params: LoginVm): Promise<LoginResultVm> {
    return await this.userService.login(params);
  }

  @Post('register')
  async register(@Body() params: RegisterVm): Promise<LoginResultVm> {
    return await this.userService.register(params);
  }

  @Get('reset-password')
  async resetPassword() {
    await this.userService.sendMail();
    return {
      message: 'Done',
    };
  }
}
