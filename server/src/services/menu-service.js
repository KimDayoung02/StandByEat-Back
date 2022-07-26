import { menuModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class MenuService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(menuModel) {
    this.menuModel = menuModel;
  }

  // 패키지 생성
  async addMenu(menuInfo) {
    // 객체 destructuring
    const { storeId, price, details, picture, menuName } = menuInfo;

    const newMenuInfo = {
      storeId,
      menuName,
      price,
      details,
      picture,
    };

    // db에 저장
    const createdNewMenu = await this.menuModel.create(newMenuInfo);

    return createdNewMenu;
  }
  // 시간 목록 전체 가져옴
  async getMenus(query) {
    const menus = await this.menuModel.findAll(query);
    return menus;
  }
  // 시간 Id로 검색
  async getMenuId(MenuId) {
    const findMenu = await this.menuModel
      .findById(MenuId)
      .populate('store', 'storeName');

    return findTime;
  }

  // 시간 수정
  async setMenu(menuInfoRequired, toUpdate) {
    // 객체 destructuring
    const menuId = menuInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let menus = await this.menuModel.findById(menuId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!menus) {
      throw new Error('메뉴 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 업데이트 진행
    menus = await this.menuModel.update({
      menuId: menuId,
      update: toUpdate,
    });

    return menus;
  }

  // 시간 삭제
  async DeleteMenu(menudate) {
    // 객체 destructuring
    const menuId = menudate;

    // db에 저장
    const deleteMenu = await this.menuModel.delete(menuId);

    return deleteMenu;
  }
}

const menuService = new MenuService(menuModel);

export { menuService };
