import { storeModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class StoreService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(storeModel) {
    this.storeModel = storeModel;
  }

  // 패키지 생성
  async addStore(storeInfo) {
    // 객체 destructuring
    const {
      storeName,
      location,
      categoryLocation,
      menu,
      phoneNumber,
      introduction,
      openingHours,
      webSite,
      maxPeopleCount,
      reservationTime,
      picture,
      notice,
      tag,
      facilities,

    } = storeInfo;

    const newStoreInfo = {
      storeName,
      location,
      categoryLocation,
      menu,
      phoneNumber,
      introduction,
      openingHours,
      webSite,
      maxPeopleCount,
      reservationTime,
      picture,
      notice,
      tag,
      facilities,
    };

    // db에 저장
    const createdNewStore = await this.storeModel.create(newStoreInfo);

    return createdNewStore;
  }
  // 상품 목록 전체 가져옴
  async getStores() {
    const stores = await this.storeModel.findAll();
    return stores;
  }
  // 상품 Id로 검색
  async getStoreId(StoreId) {
    const findStore = await this.storeModel.findById(StoreId);

    return findStore;
  }

  // 상품 목록 수정
  async setStore(storeInfoRequired, toUpdate) {
    // 객체 destructuring
    const storeId = storeInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let stores = await this.storeModel.findById(storeId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!stores) {
      throw new Error("상점 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    // const PackageName = package.packageName;
    // const Category = package.category;
    // const Country = package.country;
    // const Price = package.price;
    // const Days = package.days;
    // const Departure = package.departure;
    // const Arrival = package.arrival;
    // const TotalNumber = package.totalNumber;

    // 업데이트 진행
    stores = await this.storeModel.update({
      storeId: storeId,
      update: toUpdate,
    });

    return stores;
  }

  async setCount(storeInfoRequired, toUpdate) {
    // 객체 destructuring
    const storeId = storeInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let stores = await this.storeModel.findById(storeId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!stores) {
      throw new Error("상점 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 이제 드디어 업데이트 시작
    const countNumber = toUpdate;

    // 업데이트 진행
    stores = await this.storeModel.update({
      storeId,
      update: toUpdate,
    });

    return stores;
  }

  // 상품 삭제
  async DeleteStore(storedate) {
    // 객체 destructuring
    const storeId = storedate;

    // db에 저장
    const deleteStore = await this.storeModel.delete(storeId);

    return deleteStore;
  }

  //   // 로그인
  //   async getUserToken(loginInfo) {
  //     // 객체 destructuring
  //     const { email, password } = loginInfo;

  //     // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
  //     const user = await this.userModel.findByEmail(email);
  //     if (!user) {
  //       throw new Error(
  //         '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
  //       );
  //     }

  //     // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

  //     // 비밀번호 일치 여부 확인
  //     const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

  //     // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
  //     const isPasswordCorrect = await bcrypt.compare(
  //       password,
  //       correctPasswordHash
  //     );

  //     if (!isPasswordCorrect) {
  //       throw new Error(
  //         '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
  //       );
  //     }

  //     // 로그인 성공 -> JWT 웹 토큰 생성
  //     const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

  //     // 2개 프로퍼티를 jwt 토큰에 담음
  //     const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

  //     return { token };
  //   }

  //   // 사용자 목록을 받음.
  //   async getUsers() {
  //     const users = await this.userModel.findAll();
  //     return users;
  //   }

  //   // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  //   async setUser(userInfoRequired, toUpdate) {
  //     // 객체 destructuring
  //     const { userId, currentPassword } = userInfoRequired;

  //     // 우선 해당 id의 유저가 db에 있는지 확인
  //     let user = await this.userModel.findById(userId);

  //     // db에서 찾지 못한 경우, 에러 메시지 반환
  //     if (!user) {
  //       throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
  //     }

  //     // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

  //     // 비밀번호 일치 여부 확인
  //     const correctPasswordHash = user.password;
  //     const isPasswordCorrect = await bcrypt.compare(
  //       currentPassword,
  //       correctPasswordHash
  //     );

  //     if (!isPasswordCorrect) {
  //       throw new Error(
  //         '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
  //       );
  //     }

  //     // 이제 드디어 업데이트 시작

  //     // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
  //     const { password } = toUpdate;

  //     if (password) {
  //       const newPasswordHash = await bcrypt.hash(password, 10);
  //       toUpdate.password = newPasswordHash;
  //     }

  //     // 업데이트 진행
  //     user = await this.userModel.update({
  //       userId,
  //       update: toUpdate,
  //     });

  //     return user;
  //   }
}

const storeService = new StoreService(storeModel);

export { storeService };
