import { Injectable, ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }
  async findOne(where): Promise<User> {
    return this.userModel.findOne(where);
  }

  async register(createUserDto: CreateUserDTO): Promise<User[]> {
    const saltRound = 10;
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      saltRound,
    );
    const newUser: CreateUserDTO = {
      ...createUserDto,
      password: hashedPassword,
    };

    await this.userModel.create(newUser);
    return await this.userModel.find();
  }

  async login(loginUser: LoginUserDTO): Promise<any> {
    const { username, password }: LoginUserDTO = loginUser;
    const user: User = await this.findOne({ username });
    if (!user) {
      throw new ForbiddenException();
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new ForbiddenException();
    }
    const accessToken = await jwt.sign(user.toString(), process.env.JWT_KEY);
    return {
      token: {
        type: 'Bearer',
        accessToken,
      },
      user,
    };
  }
}
