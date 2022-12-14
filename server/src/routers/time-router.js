import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { timeService } from '../services';

const timeRouter = Router();

// 시간등록 api
timeRouter.post('/time', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { storeId, maxNumberOfReservations, date, time, count } = req.body;

    if (count > maxNumberOfReservations) {
      throw new Error('예약 가능 인원수가 초과하였습다.');
    }

    // 위 데이터를 유저 db에 추가하기
    const newTime = await timeService.addTime({
      storeId,
      maxNumberOfReservations,
      date,
      time,
      count,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newTime);
  } catch (error) {
    next(error);
  }
});

// 전체 상점 목록을 가져옴 (배열 형태임)
timeRouter.get('/times', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const times = await timeService.getTimes(req.query);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(times);
  } catch (error) {
    next(error);
  }
});

// 시간 정보 수정
// (예를 들어 /api/store/abc12345 로 요청하면 req.params.storeId는 'abc12345' 문자열로 됨)
timeRouter.patch('/time/:timeId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    // if (is.emptyObject(req.body)) {
    //   throw new Error(
    //     'headers의 Content-Type을 application/json으로 설정해주세요'
    //   );
    // }
    // params로부터 id를 가져옴
    const timeId = req.params.timeId;
    const { storeId, maxNumberOfReservations, date, time, count } = req.body;
    if (count > maxNumberOfReservations) {
      throw new Error('예약 가능 인원수가 초과하였습다.');
    }
    // let timeIdInput = [];
    // timeId.forEach(function (item) {
    //   timeIdInput.push(new ObjectId(item));
    // });

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(storeId && { storeId }),
      ...(maxNumberOfReservations && { maxNumberOfReservations }),
      ...(date && { date }),
      ...(time && { time }),
      ...(count && { count }),
    };

    // 사용자 정보를 업데이트함.
    const updatedTimeInfo = await timeService.setTime(timeId, toUpdate);
    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedTimeInfo);
  } catch (error) {
    next(error);
  }
});

// 선택 상품 삭제
timeRouter.delete('/time/:timeId', async function (req, res, next) {
  try {
    // 상품 Id 얻음
    const timeId = req.params.timeId;
    const deletetime = await timeService.DeleteTime(timeId);
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(deletetime);
  } catch (error) {
    next(error);
  }
});

export { timeRouter };
