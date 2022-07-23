import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, errorHandler, adminRequired } from "../middlewares";
import { adminService } from "../services";
import { body, validationResult } from "express-validator";

const adminRouter = Router();

const validationFunc = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  next();
};

// 회원가입 api (아래는 /register이지만, 실제로는 /admin/register로 요청해야 함.)
adminRouter.post(
  "/register",
  [
    body("pw", "패스워드는 4자리 이상으로 입력해주세요.")
      .trim()
      .isLength({ min: 4 }),

    validationFunc,
  ],
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const { id, pw } = req.body;

      const newUser = await adminService.addAdmin({
        id,
        pw,
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 로그인 api (아래는 /login 이지만, 실제로는 /admin/login로 요청해야 함.)
adminRouter.post(
  "/login",
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const { id, pw } = req.body;

      const userToken = await adminService.getAdminToken({ id, pw });

      res.status(200).json(userToken);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 사용자 정보 수정
adminRouter.patch(
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
      const { pw, currentPassword } = req.body;

      if (!currentPassword) {
        throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
      }

      const userInfoRequired = { userId, currentPassword };

      const toUpdate = {
        ...(pw && { pw }),
      };

      const updatedUserInfo = await adminService.setAdmin(
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
adminRouter.delete(
  "/delete",
  async function (req, res, next) {
    try {
      const { userId, userPassword } = req.body;
      const deleteuser = await adminService.DeleteAdmin(userId, userPassword);
      res.status(200).json(deleteuser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 관리자의 목록을 가져온다.
adminRouter.get(
  "/admins",
  adminRequired,
  async function (req, res, next) {
    try {
      const users = await adminService.getAdmins(req.query);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 관리자 한명의 정보를 가져온다.
adminRouter.get(
  "/:adminId",
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.adminId;
      const users = await adminService.getAdmin(userId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

export { adminRouter };
