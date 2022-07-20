import { model } from "mongoose";
import { OwnerSchema } from "../schemas/owner-schema";

const Owner = model("owners", OwnerSchema);

export class OwnerModel {
  // TODO: 1. create
  //       2. read
  //       3. update
  //       4. delete

  // TODO: create : 업주 스키마 생성한다(회원가입)
  async create(userInfo) {
    // user 모델과 동일
    const owner = await Owner.create(userInfo);
    return owner;
  }

  // TODO: read = 아이디로 회원을 조회한다. (회원 조회)
  async findById(id) {
    // user모델과 동일
    const owner = await Owner.findOne({ id });
    return owner;
  }

  // TODO: update = 회원 정보를 수정한다.(회원정보 수정)
  async updateUserInfo(filter, update) {
    // user모델과 동일
    const owner = await Owner.findOneAndUpdate(filter, update, { new: true });
    return owner;
  }

  // TODO: delete = 회원 정보를 삭제한다.(회원탈퇴)
  async deleteuser(filter) {
    // filter : 데이터를 찾을 조건
    // json화한 값이어야 한다. ex) {name:"elice"}
    const owner = await Owner.deleteOne(filter);
    // filter에 맞는 데이터를 삭제한다.
    // user에는 삭제한 값의 갯수를 저장한다.
    // 성공한다면 1이 될것임.
    return owner;
    // 성공한 값의 갯수를 전달.
  }
}

const ownerModel = new OwnerModel();

export { ownerModel };
