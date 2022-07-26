import { model } from "mongoose";
import { AdminSchema } from "../schemas/admin-schema";

const Admin = model("admins", AdminSchema);

export class AdminModel {
  // 관리자를 생성한다(회원가입)
  async createAdmin(userInfo) {
    const admin = await Admin.create(userInfo);
    return admin;
  }

  // 아이디로 관리자 조회한다. (회원 조회)
  async findAdminById(id) {
    const admin = await Admin.findOne({ id });
    return admin;
  }

  // 관리자 정보를 수정한다.(회원정보 수정)
  async updateAdminInfo(id, update) {
    const admin = await Admin.findOneAndUpdate({ id }, update, { new: true });
    return admin;
  }

  // 관리자 정보를 삭제한다.(회원탈퇴)
  async deleteAdminById(id) {
    const admin = await Admin.deleteOne({ id });
    return admin;
  }

  // 관리자 정보를 가져온다.(모든 회원 정보 가져오기)
  async findAllAdmins(filter) {
    const admins = await Admin.find(filter);
    return admins;
  }
}

const adminModel = new AdminModel();

export { adminModel };
