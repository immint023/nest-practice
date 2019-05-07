import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  ForbiddenException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { User, UserVm } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterVm } from './models/register.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginResultVm } from './models/login-result.model';
import { Configuration } from '../shared/configuration/configuration.enum';
import { get } from 'config';
import { LoginVm } from './models/login.model';
import { EmailService } from '../shared/email/emai.service';
import EmailTemplate from '../shared/email/email-template.interface';
import { ChangePassword } from './models/change-password.model';
import { AuthService } from '../shared/auth/auth.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {
    super();
    this._model = userModel;
  }

  // async login(params: LoginVm): Promise<LoginResultVm> {
  //   const { email, password } = params;
  //   const user = await this.findOne({ email });
  //   if (!user) {
  //     throw new ForbiddenException({
  //       status: HttpStatus.FORBIDDEN,
  //       message: 'Email or password is not correct.',
  //     });
  //   }
  //   const isCorrectPassword = await bcrypt.compare(password, user.password);
  //   if (!isCorrectPassword) {
  //     throw new ForbiddenException({
  //       status: HttpStatus.FORBIDDEN,
  //       message: 'Email or password is not correct.',
  //     });
  //   }
  //   const accessToken = await this.authService.signIn(user);

  //   return {
  //     user: new UserVm(user),
  //     accessToken,
  //   };
  // }
  async register(params: RegisterVm): Promise<LoginResultVm> {
    const { email, password } = params;
    try {
      const user = await this.findOne({ email });

      if (user) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          message: 'This email already use',
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.create({
        ...params,
        password: hashedPassword,
      });
      const accessToken = await jwt.sign(
        newUser.toString(),
        process.env[Configuration.JWT_KEY] || get(Configuration.JWT_KEY),
      );
      return {
        user: new UserVm(newUser),
        accessToken,
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async sendMail(template: EmailTemplate) {
    try {
      await this.emailService.sendMail(template);
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async changePassword(params: ChangePassword): Promise<void> {
    const { user, newPassword, confirmPassword } = params;
    if (newPassword !== confirmPassword) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu phải trùng nhau.',
      });
    }

    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu phải trùng nhau.',
      });
    }
    const isMatchedOldPassword = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (isMatchedOldPassword) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu mới không nên trùng với mật khẩu cũ.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSalt(10));
    await this.findOneAndUpdate(
      { email: user.email },
      { password: hashedPassword },
    );
  }
}
