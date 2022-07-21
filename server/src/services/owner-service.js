import { ownerModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class OwnerService {
  // 본 파일의 맨 아래에서, new OwnerService(ownerModel) 하면, 이 함수의 인자로 전달됨
  constructor(ownerModel) {
    this.ownerModel = ownerModel;
  }

  // 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { id, pw, name, phoneNumber, location, stores, profileImgUrl } =
      userInfo;

    // 아이디 중복 확인 -> 아이디가 이미 사용중이라면 true, 반대라면 false
    const user = await this.ownerModel.findById(id);

    if (user) {
      throw new Error(
        "이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요."
      );
    }

    // 아이디 중복은 이제 아니므로, 회원가입을 진행함
    // 우선 비밀번호 해쉬화(암호화)
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

    // db에 저장
    const createdNewUser = await this.ownerModel.create(newUserInfo);

    return createdNewUser;
  }

  // 로그인 성공여부 토큰 받기(일반 로그인)
  async getUserToken(loginInfo) {
    // 로그인 정보에서 순서대로 id와 pw가져옴
    const { id, pw } = loginInfo;

    // id로 가입된 회원이 있는지 확인후 그 회원 정보 가져옴.
    let user = await this.ownerModel.findById(id);
    if (!user) {
      throw new Error(
        "해당 아이디로 가입 내역이 없습니다. 다시 한번 확인해 주세요."
      );
    }

    // db에 저장되어 있는 암호화된 비밀번호
    const correctPasswordHash = user.pw;
    // db에 저장된 비밀번호와
    const isPasswordCorrect = await bcrypt.compare(pw, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error("비밀번호가 일치하지 않습니다. 다시 한번 확인해 주세요.");
    }

    // 로그인 성공 시 jwt토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: "owner" }, secretKey);
    // 코튼을 보내줌.
    return { token };
  }

  // 유저정보 수정하기, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // userInfoRequired-> {id:dasdas,pw:adasd} 이런식의 데이터
    // toUpdate : 바뀔 회원의 정보.
    // 객체 destructuring
    const { userId, currentPassword } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.ownerModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
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

    // 이제 드디어 업데이트 시작

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { pw } = toUpdate;

    if (pw) {
      const newPasswordHash = await bcrypt.hash(pw, 10);
      toUpdate.pw = newPasswordHash;
    }

    // 업데이트 진행
    user = await this.ownerModel.updateUserInfo(
      {
        id: userId,
      },
      toUpdate
    );

    return user;
  }

  // 유저 삭제
  async deleteUser(userId, userPassword, inputPassword) {
    // 객체 destructuring
    if (userPassword != inputPassword) {
      throw new Error("입력한 비밀번호와 비밀번호 확인값이 일치하지 않습니다.");
    }

    let user = await this.ownerModel.findById(userId);
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
    const deleteUser = await this.ownerModel.delete(user);

    return deleteUser;
  }
}

const ownerService = new OwnerService(ownerModel);

export { ownerService };