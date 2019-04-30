import { Model } from 'mongoose';
import { BaseModel } from './base.model';

export abstract class BaseService<T extends BaseModel> {
  constructor(protected model: Model<T>) {}

  async findAll(options: any = {}): Promise<T[]> {
    const { where, limit, skip, sort, lean = false } = options;
    return this.model
      .find(where)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean(lean);
  }

  async findOne(options: any = {}): Promise<T> {
    const { where, lean = false } = options;
    return this.model.findOne(where).lean(lean);
  }

  async findById(...options): Promise<T> {
    const [id, { lean = false }] = options;
    return this.model.findById(id).lean(lean);
  }

  async findOneAndUpdate(options: any = {}): Promise<T> {
    const { where, update, isNew } = options;
    return this.model.findOneAndUpdate(where, update, { new: isNew });
  }

  async create(data): Promise<T> {
    return this.model.create(data);
  }
}
