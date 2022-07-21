import { model } from "mongoose";
import { AdminSchema } from "../schemas/admin-schema";

const Admin = model("admins", AdminSchema);

export class AdminModel {
  // 업주 스키마 생성한다(회원가입)
  async create(userInfo) {
    // user 모델과 동일
    const admin = await Admin.create(userInfo);
    return admin;
  }

  // 아이디로 회원을 조회한다. (회원 조회)
  async findById(id) {
    // user모델과 동일
    const admin = await Admin.findOne({ id });
    return admin;
  }

  // 회원 정보를 수정한다.(회원정보 수정)
  async updateUserInfo(filter, update) {
    // user모델과 동일
    const admin = await Admin.findOneAndUpdate(filter, update, { new: true });
    return admin;
  }

  // 회원 정보를 삭제한다.(회원탈퇴)
  async deleteuser(filter) {
    // filter : 데이터를 찾을 조건
    // json화한 값이어야 한다. ex) {name:"elice"}
    const admin = await Admin.deleteOne(filter);
    // filter에 맞는 데이터를 삭제한다.
    // user에는 삭제한 값의 갯수를 저장한다.
    // 성공한다면 1이 될것임.
    return admin;
    // 성공한 값의 갯수를 전달.
  }
}

const adminModel = new AdminModel();

export { adminModel };
