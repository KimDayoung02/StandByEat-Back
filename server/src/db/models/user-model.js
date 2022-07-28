import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  // 회원을 생성한다.(회원가입)
  async createUserByUserInfo(userInfo) {
    const user = await User.create(userInfo);
    return user;
  }

  // 아이디로 회원을 조회한다. (회원조회)
  async findUserById(id) {
    const user = await User.findOne({ id });
    return user;
  }

  // 아이디로 회원을 조회한다. (Obj로 회원조회)
  async findUserByOId(_id) {
    const user = await User.findOne({ _id });
    return user;
  }

  // 회원 정보를 수정한다.(회원정보 수정)
  async updateUserInfo(id, update) {
    const user = await User.findOneAndUpdate({ id }, update, { new: true });
    return user;
  }

  // 회원 정보를 삭제한다.(회원탈퇴)
  async deleteUserById(id) {
    const user = await User.deleteOne({ id });
    return user;
  }

  // 모든 회원의 정보를 조회한다.(모든 회원 조회)
  async findAllUsers(filter) {
    const users = await User.find(filter);
    return users;
  }
}

const userModel = new UserModel();

export { userModel };
