import { JwtService } from '@nestjs/jwt';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtPayload } from './jwt-strategy.service';
import { UserVm } from '../../user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async signIn(payload: JwtPayload): Promise<string> {
    return await this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOne({ email: payload.email });
    return new UserVm(user);
  }
}
