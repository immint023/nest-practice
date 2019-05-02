import { Schema } from 'mongoose';
import { BaseModel, BaseVm } from 'src/shared/base.model';

export const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

export interface User extends BaseModel {
  username: string;
  email: string;
  password: string;
}

export class UserVm extends BaseVm<User> {
  username: string;
  email: string;
  constructor(model: User = null) {
    super(model);
  }
  getViewModel(model: User) {
    this.username = model.username;
    this.email = model.email;
  }
}
