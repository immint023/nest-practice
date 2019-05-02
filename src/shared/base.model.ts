import { Document, SchemaOptions } from 'mongoose';
export interface BaseModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseVm<T extends BaseModel> {
  created?: Date;
  updatedAt?: Date;
  protected constructor(model: T = null) {
    if (model) {
      this.created = model.createdAt;
      this.updatedAt = model.updatedAt;
      this.getViewModel(model);
    }
  }
  abstract getViewModel(model: T);
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  timestamps: true,
};
