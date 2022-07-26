import { ownerModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class OwnerService {
  constructor(ownerModel) {
    this.ownerModel = ownerModel;
  }

  // 회원가입
  async addOwner(userInfo) {
    const { id, pw, name, phoneNumber, location, stores, profileImgUrl } =
      userInfo;

    const user = await this.ownerModel.findOwnerById(id);

    if (user) {
      throw new Error(
        "이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요."
      );
    }

    const hashedPassword = await bcrypt.hash(pw, 10);

    const newUserInfo = {
      id,
      pw: hashedPassword,
      name,
      phoneNumber,
      location,
      stores,
      profileImgUrl,
    };

    const createdNewUser = await this.ownerModel.createOwnerByUserInfo(
      newUserInfo
    );

    return createdNewUser;
  }

  // 로그인 성공여부 토큰 받기(일반 로그인)
  async getOwnerToken(loginInfo) {
    const { id, pw } = loginInfo;

    let user = await this.ownerModel.findOwnerById(id);

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
    const token = jwt.sign({ userId: user._id, role: "owner" }, secretKey);
    return { token };
  }

  // 유저정보 수정하기, 현재 비밀번호가 있어야 수정 가능함.
  async setOwner(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;

    let user = await this.ownerModel.findOwnerById(userId);

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

    user = await this.ownerModel.updateOwnerInfo(userId, toUpdate);

    return user;
  }

  // 유저 삭제
  async deleteOwner(userId, userPassword) {
    let user = await this.ownerModel.findOwnerById(userId);
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

    // db에 저장
    const deleteOwner = await this.ownerModel.deleteOwnerById(userId);

    return deleteOwner;
  }

  // 업주 목록을 받음.
  async getOwners(query) {
    const owners = await this.ownerModel.findAllOwners(query);
    return owners;
  }

  // 업주 한명의 정보를 받음.
  async getOwner(id) {
    const owners = await this.ownerModel.findOwnerById(id);
    return owners;
  }
}

const ownerService = new OwnerService(ownerModel);

export { ownerService };
