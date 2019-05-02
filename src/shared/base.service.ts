import { Document, Model } from 'mongoose';

export abstract class BaseService<T extends Document> {
  protected _model: Model<T>;
  async findAll(filter = {}): Promise<T[]> {
    return this._model.find(filter);
  }
  async findOne(filter = {}): Promise<T> {
    return this._model.findOne(filter);
  }
  async findById(id): Promise<T> {
    return this._model.findById(id);
  }
  async create(data): Promise<T> {
    return this._model.create(data);
  }
  async findOneAndUpdate(filter = {}, update = {}): Promise<T> {
    return this._model.findOneAndUpdate(filter, update);
  }
  async deleteOne(filter = {}): Promise<void> {
    this._model.deleteOne(filter);
  }
}
