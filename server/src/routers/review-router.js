import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, errorHandler, adminRequired } from "../middlewares";
import { reviewService } from "../services";
import { body, validationResult } from "express-validator";

const reviewRouter = Router();

const validationFunc = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  next();
};

reviewRouter.post(
  "/register",
  
  async (req, res, next) => {
    try {
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request)의 body 에서 데이터 가져오기
      const userId = req.body.userId;
      const storeId = req.body.storeId;
      const reviewScore = req.body.reviewScore;
      const reviewImgUrl = req.body.reviewImgUrl;
      const reviewregisterTime = "현재 시간";
      const reviewContent = req.body.reviewContent;

      // 위 데이터를 리뷰 db에 추가하기
      const newReview = await reviewService.addReview({
        userId,
        storeId,
        reviewScore,
        reviewImgUrl,
        reviewregisterTime,
        reviewContent,
      });

      // 추가된 리뷰의 db 데이터를 프론트에 다시 보내줌
      // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
      res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 리뷰 정보 수정
reviewRouter.patch(
  "/reviewInfoupdate/:reviewId",
  async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // params로부터 id를 가져옴
      const reviewId = req.params.reviewId;     
      const toUpdate = {
        ...(reviewContent && { reviewContent }),
      }
      // 사용자 정보를 업데이트함.
      const updatedUserInfo = await reviewService.setReview(
        reviewId,
        toUpdate
      );

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// // 관리자 권한 수정

// 사용자 삭제
reviewRouter.delete(
  "/deleteReview",
  async function (req, res, next) {
    try {
      // 상품 Id 얻음
      const reviewId = req.body.userId;
      const deleteuser = await reviewService.DeleteUser(reviewId);
      res.status(200).json(deleteuser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 관리자의 목록을 가져온다.
reviewRouter.get(
  "/reviews",
  // adminRequired,
  async function (req, res, next) {
    try {
      // 전체 사용자 목록을 얻음
      const users = await reviewService.getUsers(req.query);
      // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 업주 한명의 정보를 가져온다.
reviewRouter.get(
  "/review/:reviewId",
  // loginRequired,
  async function (req, res, next) {
    try {
      // 전체 사용자 목록을 얻음
      const userId = req.params.reviewId;
      const users = await reviewService.getUser(userId);
      // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

export { reviewRouter };
