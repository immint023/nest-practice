import { Schema } from 'mongoose';
import { BaseModel, BaseVm } from 'src/shared/base.model';

export const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    codeResetPassword: String,
    expiredAt: Date,
  },
  {
    timestamps: true,
  },
);

export interface User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  codeResetPassword: string;
  expiredAt: Date;
}

export class UserVm extends BaseVm<User> {
  email: string;
  firstName: string;
  lastName: string;
  constructor(model: User = null) {
    super(model);
  }
  getViewModel(model: User) {
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
  }
}
