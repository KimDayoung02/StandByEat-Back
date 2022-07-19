import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  // TODO: 1. create
  //       2. read
  //       3. update
  //       4. delete

  async create(userInfo) {
    // userInfo는 배열 형태여야 한다. 참고문서 : https://mongoosejs.com/docs/api/model.html#model_Model-create
    // [{name:"aaaaaaa"},{age:13}]
    const user = await User.create(userInfo);
    // userInfo로 Users에 데이터 생성
    return user;
    // 생성한 데이터 정보 보내줌.
  }

  async get(userInfo) {
    const user = await user.findOne(userInfo);
    //userInfo와 내용이 일치하는 회원의 정보를 가져옴.
    return user;
    // 찾은 회원의 정보를 보내줌.
  }

  async findById(id) {
    const user = await User.findOne({ id });
    return user;
  }

  // async findById(userId) {
  //   const user = await User.findOne({ _id: userId });
  //   return user;
  // }
  // async findByPhoneNumber(phone) {
  //   const userphone = await User.findOne({ phoneNumber: phone });
  //   return userphone;
  // }
  // async findByTelNumber(tel) {
  //   const usertel = await User.findOne({ telNumber: tel });
  //   return usertel;
  // }
  // async create(userInfo) {
  //   const createdNewUser = await User.create(userInfo);
  //   return createdNewUser;
  // }

  // async findAll(query) {
  //   const users = await User.find(query);
  //   return users;
  // }

  // async update({ userId, update }) {
  //   const filter = { _id: userId };
  //   const option = { returnOriginal: false };

  //   const updatedUser = await User.findOneAndUpdate(filter, update, option);
  //   return updatedUser;
  // }
  // async delete(userId) {
  //   const deleteuser = await User.findByIdAndDelete({ _id: userId });
  //   return deleteuser;
  // }
}

const userModel = new UserModel();

export { userModel };
