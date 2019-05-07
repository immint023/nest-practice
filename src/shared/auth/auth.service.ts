import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtPayload } from './jwt-strategy.service';
import { UserVm } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(): Promise<string> {
    const user: JwtPayload = { email: 'nvminh023@gmail.com' };
    return this.jwtService.sign(user);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    console.log(payload);
    const user = await this.userService.findOne({ email: payload.email });
    return new UserVm(user);
  }
}
