import { model } from "mongoose";
import { OwnerSchema } from "../schemas/owner-schema";

const Owner = model("owners", OwnerSchema);

export class OwnerModel {
  // 업주 스키마 생성한다(회원가입)
  async createOwnerByUserInfo(userInfo) {
    const owner = await Owner.create(userInfo);
    return owner;
  }

  // 아이디로 회원을 조회한다. (회원 조회)
  async findOwnerById(id) {
    const owner = await Owner.findOne({ id });
    return owner;
  }

  // 회원 정보를 수정한다.(회원정보 수정)
  async updateOwnerInfo(id, update) {
    const owner = await Owner.findOneAndUpdate({ id }, update, { new: true });
    return owner;
  }

  // 회원 정보를 삭제한다.(회원탈퇴)
  async deleteOwnerById(id) {
    // filter : 데이터를 찾을 조건
    const owner = await Owner.deleteOne({ id });
    return owner;
  }

  // 회원 정보를 가져온다.(모든 회원 정보 가져오기)
  async findAllOwners(filter) {
    // filter(조건)에 따른 모든 정보를 가져온다.
    const owners = await Owner.find(filter);
    return owners;
  }
}

const ownerModel = new OwnerModel();

export { ownerModel };
