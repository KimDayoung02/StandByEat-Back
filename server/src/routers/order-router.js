import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

// 주문등록 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
orderRouter.post('/order', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const userId = req.body.userId;
    const storeId = req.body.storeId;
    const numberOfReservations = req.body.numberOfReservations;
    const reservationTime = req.body.reservationTime;
    const fee = req.body.fee;
    const requirements = req.body.requirements;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      userId,
      storeId,
      numberOfReservations,
      reservationTime,
      fee,
      requirements,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 전체 주문 목록을 가져옴 (배열 형태임)
orderRouter.get('/orders', async function (req, res, next) {
  try {
    // 전체 주문 목록을 얻음
    const orders = await orderService.getOrders();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

//주문 ID로 정보가져오기
orderRouter.get('/order/:orderId', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const orderId = req.params.orderId;

    const getId = await orderService.getOrderId(orderId);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(getId);
  } catch (error) {
    next(error);
  }
});

// 주문 정보 수정
// (예를 들어 /api/store/abc12345 로 요청하면 req.params.storeId는 'abc12345' 문자열로 됨)
orderRouter.patch('/order/:orderId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    // params로부터 id를 가져옴
    const orderId = req.params.orderId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const userId = req.body.userId;
    const storeId = req.body.storeId;
    const numberOfReservations = req.body.numberOfReservations;
    const reservationTime = req.body.reservationTime;
    const fee = req.body.fee;
    const requirements = req.body.requirements;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(userId && { userId }),
      ...(storeId && { storeId }),
      ...(numberOfReservations && { numberOfReservations }),
      ...(fee && { fee }),
      ...(requirements && { requirements }),
    };

    // 사용자 정보를 업데이트함.
    const updatedOrderInfo = await orderService.setOrder(orderId, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedOrderInfo);
  } catch (error) {
    next(error);
  }
});

// 선택 상품 삭제
orderRouter.delete('/order/:orderId', async function (req, res, next) {
  try {
    // 상품 Id 얻음
    const orderId = req.params.orderId;
    const deleteorder = await orderService.DeleteOrder(orderId);
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(deleteorder);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
