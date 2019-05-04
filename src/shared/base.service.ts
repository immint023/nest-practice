import { Document, Model } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';

export abstract class BaseService<T extends Document> {
  protected _model: Model<T>;
  async findAll(filter = {}): Promise<T[]> {
    try {
      return await this._model.find(filter).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async findOne(filter = {}): Promise<T> {
    try {
      return this._model.findOne(filter).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async findById(id): Promise<T> {
    try {
      return await this._model.findById(id).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async create(data): Promise<T> {
    try {
      return await this._model.create(data);
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async findOneAndUpdate(filter = {}, update = {}): Promise<T> {
    try {
      return await this._model.findOneAndUpdate(filter, update).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
  async deleteOne(filter = {}): Promise<void> {
    try {
      this._model.deleteOne(filter).exec();
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
}
