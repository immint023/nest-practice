import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import * as shortid from 'shortid';
import { UserService } from './user.service';
import { UserVm } from './models/user.model';
import { LoginResultVm } from './models/login-result.model';
import { RegisterVm } from './models/register.model';
import { LoginVm } from './models/login.model';
import { ResetPasswordVm } from './models/reset-password.model';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/shared/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req): Promise<UserVm[]> {
    console.log(req.user);
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

  @Post('reset-password')
  async resetPassword(@Body() params: ResetPasswordVm): Promise<LoginResultVm> {
    const { email, code, password, confirmPassword } = params;
    const user = await this.userService.findOne({
      email,
      codeResetPassword: code,
    });
    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Không tìm thấy tài khoản.',
      });
    }

    const isExpiredCode = <any>new Date() - <any>new Date(user.expiredAt) > 0;
    if (isExpiredCode) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Code is expired.',
      });
    }
    return this.userService.changePassword({
      email: email,
      password,
      confirmPassword,
    });
  }
}
