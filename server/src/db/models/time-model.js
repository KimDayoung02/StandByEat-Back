import { model } from 'mongoose';
const mongoose = require('mongoose');
import { TimeSchema } from '../schemas/time-schema';
// import { ObjectId } from 'mongoose';
// import { ObjectId } from '..db';

const Time = model('time', TimeSchema);

export class TimeModel {
  async create(timeInfo) {
    const createdNewTime = await Time.create(timeInfo);
    return createdNewTime;
  }

  async findAll(query) {
    const times = await Time.find(query);
    return times;
  }

  async findById(timeId) {
    const findtime = await Time.findOne({ _id: timeId });
    return findtime;
  }

  async update({ timeId, update }) {
    const filter = { _id: timeId };

    const updatedTime = await Time.findOneAndUpdate(filter, update);
    return updatedTime;
  }

  async delete(timeId) {
    const deleteTime = await Time.findByIdAndDelete({ _id: timeId });
    return deleteTime;
  }
}

const timeModel = new TimeModel();

export { timeModel };
