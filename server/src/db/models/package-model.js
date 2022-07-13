import { model } from "mongoose";
const mongoose = require("mongoose");
import { PackageSchema } from "../schemas/package-schema";
// import { ObjectId } from 'mongoose';
// import { ObjectId } from '..db';

const Package = model("package", PackageSchema);

export class PackageModel {
  async findByPackageName(packageName) {
    const PackageName = await Package.findOne({ packageName });
    return PackageName;
  }

  async create(packageInfo) {
    const createdNewPackage = await Package.create(packageInfo);
    return createdNewPackage;
  }

  async findAll() {
    const packages = await Package.find({});
    return packages;
  }
  async findById(packageId) {
    const findpackage = await Package.findOne({ _id: packageId });
    return findpackage;
  }

  async update({ packageId, update }) {
    const filter = { _id: packageId };

    const updatedPackage = await Package.findOneAndUpdate(filter, update);
    return updatedPackage;
  }

  async delete(packageId) {
    const deletepackage = await Package.findByIdAndDelete({ _id: packageId });
    return deletepackage;
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

const packageModel = new PackageModel();

export { packageModel };
