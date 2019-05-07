import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import * as shortid from 'shortid';
import { UserService } from './user.service';
import { UserVm } from './models/user.model';
import { LoginResultVm } from './models/login-result.model';
import { RegisterVm } from './models/register.model';
import { LoginVm } from './models/login.model';
import { AuthGuard } from '@nestjs/passport';
import { ChangePassword } from './models/change-password.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('token')
  async getToken() {
    // return this.authService.signIn({ email: 'aaaa' });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req): Promise<UserVm[]> {
    const users = await this.userService.findAll();
    return users.map(user => new UserVm(user));
  }

  // @Post('login')
  // async login(@Body() params: LoginVm): Promise<LoginResultVm> {
  //   return await this.userService.login(params);
  // }

  @Post('register')
  async register(@Body() params: RegisterVm): Promise<LoginResultVm> {
    return await this.userService.register(params);
  }

  @Post('send-code')
  async sendCode(@Body('email') email: string): Promise<object> {
    const duration = new Date(new Date(Date.now() + 2 * 60 * 1000)); //plus 2 minute
    const codeResetPassword = shortid.generate();
    const user = await this.userService.findOneAndUpdate(
      { email },
      { expiredAt: duration, codeResetPassword },
    );

    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Email is not correct.',
      });
    }

    await this.userService.sendMail({
      to: email,
      from: 'zukiboom@gmail.com',
      html: `<p>${codeResetPassword}</p>`,
      subject: 'Reset Password.',
      text: 'Xin chao.',
    });
    return {
      status: HttpStatus.OK,
      message: 'Sent Successly',
    };
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() params: ChangePassword, @Req() req) {
    console.log(req.user);
    // await this.userService.changePassword({ ...params, user: req.user });
    return {
      message: 'Done',
    };
  }
}
