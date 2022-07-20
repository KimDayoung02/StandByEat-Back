import { json } from "express";
import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  // TODO: 1. create
  //       2. read
  //       3. update
  //       4. delete

  // TODO: create = 회원을 생성한다.(회원가입)
  async create(userInfo) {
    // userInfo는 배열 형태여야 한다. 참고문서 : https://mongoosejs.com/docs/api/model.html#model_Model-create
    // [{name:"aaaaaaa"},{age:13}]
    // 문서 참고시
    // projection: 특정 필드를 보여줄지 설정
    // conditions: 조건 설정

    const user = await User.create(userInfo);
    // userInfo로 Users에 데이터 생성
    return user;
    // 생성한 데이터 정보 보내줌.
  }

  // TODO: read = 아이디로 회원을 조회한다. (회원조회)
  async findById(id) {
    const user = await User.findOne({ id });
    // 아이디를 통해서 사용자를 찾음.
    if (user) {
      return true;
    } else {
      return false;
    }
    // 찾은 사용자가 있다면 true, 없다면 false를 줌
  }

  // TODO: update = 회원 정보를 수정한다.(회원정보 수정)
  async updateUserInfo(filter, update) {
    // filter : 데이터를 찾을 조건
    // update : 바꿀 내용
    // 두 조건다 json화 한 값이어야 함. ex) {name:"elice"}
    const user = await User.findOneAndUpdate(filter, update, { new: true });
    // filter에 해당하는 데이터를 찾아 update에 따라 내용을 바꾼다.
    // user에는 바뀌기 전의 값이 저장.
    return user;
    // 바뀌기 전의 값을 전달해준다.
  }

  // TODO: delete = 회원 정보를 삭제한다.(회원탈퇴)
  async deleteuser(filter) {
    // filter : 데이터를 찾을 조건
    // json화한 값이어야 한다. ex) {name:"elice"}
    const user = await User.deleteOne(filter);
    // filter에 맞는 데이터를 삭제한다.
    // user에는 삭제한 값의 갯수를 저장한다.
    // 성공한다면 1이 될것임.
    return user;
    // 성공한 값의 갯수를 전달.
  }
}

const userModel = new UserModel();

export { userModel };
