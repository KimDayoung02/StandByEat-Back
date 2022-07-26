import { timeModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class TimeService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(timeModel) {
    this.timeModel = timeModel;
  }

  // 패키지 생성
  async addTime(timeInfo) {
    // 객체 destructuring
    const {
      storeId,
      maxNumberOfReservations,
      year,
      month,
      day,
      hour,
      min,
      count,
    } = timeInfo;

    const newTimeInfo = {
      storeId,
      maxNumberOfReservations,
      year,
      month,
      day,
      hour,
      min,
      count,
    };

    // db에 저장
    const createdNewTime = await this.timeModel.create(newTimeInfo);

    return createdNewTime;
  }
  // 시간 목록 전체 가져옴
  async getTimes(query) {
    const times = await this.timeModel.findAll(query);
    return times;
  }
  // 시간 Id로 검색
  async getTimeId(TimeId) {
    const findTime = await this.timeModel
      .findById(TimeId)
      .populate('store', 'storeName');

    return findTime;
  }

  // 시간 수정
  async setTime(timeInfoRequired, toUpdate) {
    // 객체 destructuring
    const timeId = timeInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let times = await this.timeModel.findById(timeId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!times) {
      throw new Error('시간 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 업데이트 진행
    times = await this.timeModel.update({
      timeId: timeId,
      update: toUpdate,
    });

    return times;
  }

  // 시간 삭제
  async DeleteTime(timedate) {
    // 객체 destructuring
    const timeId = timedate;

    // db에 저장
    const deleteTime = await this.timeModel.delete(timeId);

    return deleteTime;
  }
}

const timeService = new TimeService(timeModel);

export { timeService };
