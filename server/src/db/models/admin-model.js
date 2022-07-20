import { model } from "mongoose";
import { AdminSchema } from "../schemas/admin-schema";

const User = model("admins", AdminSchema);

export class AdminModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }
  async findByPhoneNumber(phone) {
    const userphone = await User.findOne({ phoneNumber: phone });
    return userphone;
  }
  async findByTelNumber(tel) {
    const usertel = await User.findOne({ telNumber: tel });
    return usertel;
  }
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll(query) {
    const users = await User.find(query);
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }
  async delete(userId) {
    const deleteuser = await User.findByIdAndDelete({ _id: userId });
    return deleteuser;
  }
}

const adminModel = new AdminModel();

export { adminModel };
