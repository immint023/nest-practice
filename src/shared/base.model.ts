import { Document, SchemaOptions } from 'mongoose';

export interface BaseModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  id?: Date;
}

export abstract class BaseVm<T extends BaseModel> {
  createdAt?: Date;
  updatedAt?: Date;
  id?: Date;
  constructor(model: T = null) {
    if (model) {
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
      this.id = model.id;
      this.getViewModel(model);
    }
  }
  abstract getViewModel(model: T);
}

export const schemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
};
