import { userModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  // 회원가입
  async addUser(userInfo) {
    const {
      id,
      pw,
      name,
      phoneNumber,
      nickName,
      location,
      birth,
      // profileImgUrl,
    } = userInfo;

    const user = await this.userModel.findUserById(id);

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
      nickName,
      location,
      birth,
      // profileImgUrl,
    };

    const createdNewUser = await this.userModel.createUserByUserInfo(
      newUserInfo
    );

    return createdNewUser;
  }

  // 로그인 성공여부 토큰 받기(일반 로그인)
  async getUserToken(loginInfo) {
    const { id, pw } = loginInfo;

    let user = await this.userModel.findUserById(id);
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
    const token = jwt.sign(
      { id: id, userId: user._id, role: "user" },
      secretKey
    );
    return { token };
  }

  // 유저정보 수정하기, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;

    let user = await this.userModel.findUserById(userId);

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

    user = await this.userModel.updateUserInfo(userId, toUpdate);

    return user;
  }

  // 유저 삭제
  async deleteUser(userId, userPassword) {
    let user = await this.userModel.findUserById(userId);
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
    const deleteUser = await this.userModel.deleteUserById(userId);

    return deleteUser;
  }

  // 관리자 권한으로 유저 삭제
  async deleteUserByAdmin(_id) {
    let user = await this.userModel.findUserByOId(_id);

    if (!user) {
      throw new Error("이미 없는 사용자 입니다.");
    }
    const userId = user.id;
    // db에 저장
    const deleteUser = await this.userModel.deleteUserById(userId);

    return deleteUser;
  }

  // 조건에 해당하는 모든 유저 정보를 받음
  async getUsers(filter) {
    const users = await this.userModel.findAllUsers(filter);
    return users;
  }

  // 유저 한명의 정보를 받음.
  async getUser(id) {
    const owners = await this.userModel.findUserById(id);
    return owners;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 카카오 Oauth 로그인
  // 카카오 회원의 정보 (이메일-> 아이디)
  async getUserTokenWithKakao(email) {
    if (!email) {
      throw new Error("로그인을 위해서는 이메일 필요합니다");
    }

    const user = await this.userModel.findUserById(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);
    const role = "user";

    return { token, role };
  }

  // 카카오 Oauth 회원가입
  async addUserWithKakao(email, nickname) {
    if (!email || !nickname) {
      throw new Error("회원가입을 위해서는 이메일과 이름이 필요합니다");
    }

    const user = await this.userModel.findUserById(email);
    if (user) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    }

    const password = "kakao";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      id: email,
      name: nickname,
      password: hashedPassword,
      phoneNumber: "010-1111-2222",
    };

    const createdNewUser = await this.userModel.createUserByUserInfo(
      newUserInfo
    );

    return createdNewUser;
  }
}

const userService = new UserService(userModel);

export { userService };
