import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
  name: String,
  age: Number,
});
