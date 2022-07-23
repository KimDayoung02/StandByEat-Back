import { Router } from "express";
import is from "@sindresorhus/is";
import {
  loginRequired,
  errorHandler,
  ownerRequired,
  adminRequired,
  registerCheck,
} from "../middlewares";
import { ownerService } from "../services";

const ownerRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /owner/register로 요청해야 함.)
ownerRouter.post(
  "/register",
  registerCheck,
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const { id, pw, name, phoneNumber, location, stores } = req.body;
      const profileImgUrl = `https://avatars.dicebear.com/api/identicon/${id}.svg`;
      const newUser = await ownerService.addOwner({
        id,
        pw,
        name,
        phoneNumber,
        location,
        stores,
        profileImgUrl,
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 로그인 api (아래는 /login 이지만, 실제로는 /owner/login로 요청해야 함.)
ownerRouter.post(
  "/login",
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const { id, pw } = req.body;

      const userToken = await ownerService.getOwnerToken({ id, pw });

      res.status(200).json(userToken);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 사용자 정보 수정
ownerRouter.patch(
  "/update/:userId",
  loginRequired,
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const userId = req.params.userId;

      const {
        name,
        phoneNumber,
        location,
        stores,
        profileImgUrl,
        pw,
        currentPassword,
      } = req.body;
      if (!pw) {
        throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
      }

      const userInfoRequired = { userId, currentPassword };

      const toUpdate = {
        ...(name && { name }),
        ...(location && { location }),
        ...(phoneNumber && { phoneNumber }),
        ...(stores && { stores }),
        ...(profileImgUrl && { profileImgUrl }),
        ...(pw && { pw }),
      };

      const updatedUserInfo = await ownerService.setOwner(
        userInfoRequired,
        toUpdate
      );

      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 사용자 삭제
ownerRouter.delete(
  "/delete",
  async function (req, res, next) {
    try {
      const { userId, password } = req.body;
      const deleteuser = await ownerService.deleteOwner(userId, password);
      res.status(200).json(deleteuser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 업주의 목록을 가져온다.
ownerRouter.get(
  "/owners",
  ownerRequired,
  async function (req, res, next) {
    try {
      const users = await ownerService.getOwners(req.query);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 업주 한명의 정보를 가져온다.
ownerRouter.get(
  "/:ownerId",
  loginRequired,
  async function (req, res, next) {
    try {
      const ownerId = req.params.ownerId;
      const users = await ownerService.getOwner(ownerId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

export { ownerRouter };
