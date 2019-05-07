import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy.service';
import { UserModule } from '../../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { get } from 'config';
import { Configuration } from '../configuration/configuration.enum';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_KEY,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
