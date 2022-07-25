import { adminModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AdminService {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }
  // 회원가입
  async addAdmin(userInfo) {
    const { id, pw } = userInfo;

    const user = await this.adminModel.findAdminById(id);

    if (user) {
      throw new Error(
        "이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요."
      );
    }

    const hashedPassword = await bcrypt.hash(pw, 10);

    const newUserInfo = {
      id,
      pw: hashedPassword,
    };

    const createdNewUser = await this.adminModel.createAdmin(newUserInfo);

    return createdNewUser;
  }

  // 로그인 성공여부 토큰 받기(일반 로그인)
  async getAdminToken(loginInfo) {
    const { id, pw } = loginInfo;

    let user = await this.adminModel.findAdminById(id);
    if (!user) {
      throw new Error(
        "해당 아이디로 가입 내역이 없습니다. 다시 한번 확인해 주세요."
      );
    }

    const correctPasswordHash = user.pw;
    const isPasswordCorrect = await bcrypt.compare(pw, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error("비밀번호가 일치하지 않습니다. 다시 한번 확인해 주세요.");
    }

    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign({ userId: user._id, role: "admin" }, secretKey);
    return { token };
  }

  // 유저정보 수정하기, 현재 비밀번호가 있어야 수정 가능함.
  async setAdmin(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;

    let user = await this.adminModel.findAdminById(userId);

    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    const correctPasswordHash = user.pw;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    const { pw } = toUpdate;

    if (pw) {
      const newPasswordHash = await bcrypt.hash(pw, 10);
      toUpdate.pw = newPasswordHash;
    }

    user = await this.adminModel.updateAdminInfo(userId, toUpdate);

    return user;
  }

  // 유저 삭제
  async DeleteAdmin(userId, userPassword) {
    let user = await this.adminModel.findAdminById(userId);
    const correctPasswordHash = user.pw;
    const isPasswordCorrect = await bcrypt.compare(
      userPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한번 확인해 주세요."
      );
    }

    const deleteUser = await this.adminModel.deleteAdminById(userId);

    return deleteUser;
  }

  // 관리자 목록을 받음.
  async getAdmins(query) {
    const admins = await this.adminModel.findAllAdmins(query);
    return admins;
  }

  // 관리자 한명의 정보를 받음.
  async getAdmin(id) {
    const admin = await this.adminModel.findAdminById(id);
    console.log(admin);
    return admin;
  }
}

const adminService = new AdminService(adminModel);

export { adminService };
