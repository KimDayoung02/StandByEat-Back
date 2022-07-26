import { model } from 'mongoose';
const mongoose = require('mongoose');
import { StoreSchema } from '../schemas/store-schema';
// import { ObjectId } from 'mongoose';
// import { ObjectId } from '..db';

const Store = model('store', StoreSchema);

export class StoreModel {
  async findByStoreName(storeName) {
    const StoreName = await Store.findOne({ storeName });
    return StoreName;
  }

  async create(storeInfo) {
    const createdNewStore = await Store.create(storeInfo);
    return createdNewStore;
  }

  async findAll() {
    const stores = await Store.find({});
    return stores;
  }
  async findById(storeId) {
    const findstore = await Store.findOne({ _id: storeId }).populate('timeId');
    return findstore;
  }

  async update({ storeId, update }) {
    const filter = { _id: storeId };

    const updatedStore = await Store.findOneAndUpdate(filter, update);
    return updatedStore;
  }
  async timeupdate({ storeId, update }) {
    const filter = { _id: storeId };

    const updatedTime = await Store.findOneAndUpdate(filter, { $push: update });
    return updatedTime;
  }

  async delete(storeId) {
    const deleteStore = await Store.findByIdAndDelete({ _id: storeId });
    return deleteStore;
  }
}

// export class UserModel {
//   async findByEmail(email) {
//     const user = await User.findOne({ email });
//     return user;
//   }

//   async findById(userId) {
//     const user = await User.findOne({ _id: userId });
//     return user;
//   }

//   async create(userInfo) {
//     const createdNewUser = await User.create(userInfo);
//     return createdNewUser;
//   }

//   async findAll() {
//     const users = await User.find({});
//     return users;
//   }

//   async update({ userId, update }) {
//     const filter = { _id: userId };
//     const option = { returnOriginal: false };

//     const updatedUser = await User.findOneAndUpdate(filter, update, option);
//     return updatedUser;
//   }
// }

const storeModel = new StoreModel();

export { storeModel };
