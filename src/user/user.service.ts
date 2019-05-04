import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
  ForbiddenException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { User, UserVm } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterVm } from './models/register.model';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginResultVm } from './models/login-result.model';
import { Configuration } from 'src/shared/configuration/configuration.enum';
import { get } from 'config';
import { LoginVm } from './models/login.model';
import { EmailService } from 'src/shared/email/emai.service';
import EmailTemplate from 'src/shared/email/email-template.interface';
import { ResetPasswordVm } from './models/reset-password.model';
import { ChangePassowrdVm } from './models/change-password.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {
    super();
    this._model = userModel;
  }

  async login(params: LoginVm): Promise<LoginResultVm> {
    const { email, password } = params;
    const user = await this.findOne({ email });
    if (!user) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: 'Email or password is not correct.',
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: 'Email or password is not correct.',
      });
    }
    const accessToken = await jwt.sign(
      user.toString(),
      process.env[Configuration.JWT_KEY] || get(Configuration.JWT_KEY),
    );

    return {
      user: new UserVm(user),
      accessToken,
    };
  }

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
  async changePassword(params: ChangePassowrdVm): Promise<LoginResultVm> {
    const { email, password, confirmPassword } = params;
    const isDuplicatePassword = password === confirmPassword;
    if (!isDuplicatePassword) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu không khớp.',
      });
    }
    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found.',
      });
    }

    const isSimilarOldPassword = await bcrypt.compare(password, user.password);

    if (isSimilarOldPassword) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Mật khẩu mới không nên trùng với mật khẩu cũ.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.findOneAndUpdate({ email }, { password: hashedPassword });
    const accessToken = await jwt.sign(
      user.toString(),
      process.env[Configuration.JWT_KEY] || get(Configuration.JWT_KEY),
    );

    return {
      user: new UserVm(user),
      accessToken,
    };
  }
}
