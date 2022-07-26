import { storeModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
      menuId,
      phoneNumber,
      introduction,
      openingHours,
      webSite,
      timeId,
      picture,
      notice,
      tag,
      facilities,
      latitude,
      hardness,
    } = storeInfo;

    const newStoreInfo = {
      storeName,
      location,
      categoryLocation,
      menuId,
      phoneNumber,
      introduction,
      openingHours,
      webSite,
      timeId,
      picture,
      notice,
      tag,
      facilities,
      latitude,
      hardness,
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
      throw new Error('상점 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 업데이트 진행
    stores = await this.storeModel.update({
      storeId: storeId,
      update: toUpdate,
    });

    return stores;
  }
  // 시간 추가
  async pushTime(storeInfoRequired, toUpdate) {
    // 객체 destructuring
    const storeId = storeInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let stores = await this.storeModel.findById(storeId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!stores) {
      throw new Error('상점 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 업데이트 진행
    stores = await this.storeModel.timeupdate({
      storeId: storeId,
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
}

const storeService = new StoreService(storeModel);

export { storeService };
