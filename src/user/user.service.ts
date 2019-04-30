import { Injectable, ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BaseService } from '../shared/base.service';
import { User, UserVm } from './models/user.model';
import { LoginResultVm } from './models/login-result.model';
import { LoginVm } from './models/login.model';
import { RegisterVm } from './models/register.model';
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    super(userModel);
  }

  async login({ email, password }: LoginVm): Promise<LoginResultVm> {
    const user = await this.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new ForbiddenException();
    }
    const accessToken = await jwt.sign(user.toString(), process.env.JWT_KEY);
    return {
      user: new UserVm(user),
      token: accessToken,
    };
  }

  async register(params: RegisterVm): Promise<LoginResultVm> {
    const user = await this.create(params);
    const accessToken = await jwt.sign(user.toString(), process.env.JWT_KEY);
    return {
      user: new UserVm(user),
      token: accessToken,
    };
  }
}
