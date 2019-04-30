import { Schema } from 'mongoose';
import { BaseModel, BaseVm } from '../../shared/base.model';

export const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  age: Number,
});

export interface User extends BaseModel {
  username: string;
  email: string;
  password: string;
  group: string;
  age: number;
}

export class UserVm extends BaseVm<User> {
  username: string;
  group: string;
  email: string;
  age: number;
  constructor(model: User = null) {
    super(model);
  }
  getViewModel(model: User) {
    this.username = model.username;
    this.group = model.group;
    this.age = model.age;
    this.email = model.email;
  }
}
