import { Router } from "express";
import is from "@sindresorhus/is";
import {
  loginRequired,
  errorHandler,
  adminRequired,
  registerCheck,
} from "../middlewares";

import { commonService } from "../services";
const commonRouter = Router();

// 토큰으로 권한 가져오기
commonRouter.get(
  "/role",
  async (req, res, next) => {
    try {
      const userToken = req.headers["authorization"]?.split(" ")[1];
      const role = commonService.checkRole(userToken);

      res.status(201).json(role);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 토큰으로 아이디(_id) 가져오기
commonRouter.get(
  "/oid",
  async (req, res, next) => {
    try {
      const userToken = req.headers["authorization"]?.split(" ")[1];

      const id = commonService.getDBIdWithToken(userToken);

      res.status(201).json(id);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 토큰으로 아이디 가져오기
commonRouter.get(
  "/id",
  async (req, res, next) => {
    try {
      const userToken = req.headers["authorization"]?.split(" ")[1];

      const id = commonService.getIdWithToken(userToken);

      res.status(201).json(id);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

export { commonRouter };
