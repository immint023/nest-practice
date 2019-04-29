import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  age: Number,
});
