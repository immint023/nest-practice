import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserModel }])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class UserModule {}
