import { Router } from 'express';
import is from '@sindresorhus/is';
import {
  loginRequired,
  errorHandler,
  adminRequired,
  registerCheck,
} from '../middlewares';
import { userService } from '../services';
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const userRouter = Router();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'standbyeat', // 버킷 이름 입력
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `user/${Date.now()}_${file.originalname}}`);
    },
  }),
});

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post(
  '/register',
  registerCheck,
  async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

      const { id, pw, name, phoneNumber, nickName, location, birth } = req.body;
      const profileImgUrl = `https://avatars.dicebear.com/api/identicon/${id}.svg`;

      const newUser = await userService.addUser({
        id,
        pw,
        name,
        phoneNumber,
        nickName,
        location,
        birth,
        profileImgUrl,
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post(
  '/login',
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

      const { id, pw } = req.body;

      const userToken = await userService.getUserToken({ id, pw });

      res.status(200).json(userToken);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 사용자 정보 수정
userRouter.patch(
  '/update/:userId',
  loginRequired,
  upload.single('profileImgUrl'),
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

      const userId = req.params.userId;
      const profileImgUrl = req.file?.location;

      const {
        name,
        phoneNumber,
        nickName,
        location,
        birth,
        gender,
        pw,
        currentPassword,
      } = req.body;

      if (!currentPassword) {
        throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
      }

      const userInfoRequired = { userId, currentPassword };

      const toUpdate = {
        ...(name && { name }),
        ...(nickName && { nickName }),
        ...(location && { location }),
        ...(phoneNumber && { phoneNumber }),
        ...(birth && { birth }),
        ...(gender && { gender }),
        ...(profileImgUrl && { profileImgUrl }),
        ...(pw && { pw }),
      };

      const updatedUserInfo = await userService.setUser(
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
userRouter.delete(
  '/delete',
  async function (req, res, next) {
    try {
      const { userId, userPassword } = req.body;
      const deleteuser = await userService.deleteUser(userId, userPassword);
      res.status(200).json(deleteuser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 모든 유저 정보를 가져옴
userRouter.get(
  '/users',
  // adminRequired,
  async function (req, res, next) {
    try {
      const users = await userService.getUsers(req.query);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 유저 한명의 정보를 가져온다.
userRouter.get(
  '/:userId',
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.userId;
      const users = await userService.getUser(userId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 유저 한명의 정보를 가져온다.
userRouter.delete(
  '/delete/:userObi',
  adminRequired,
  async function (req, res, next) {
    try {
      const _id = req.params.userObi;
      const users = await userService.deleteUserByAdmin(_id);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

///////////////////////////////////////////////////////////////////////////////////////////////
// 카카오 회원가입
userRouter.post('/register/kakao', async (req, res, next) => {
  try {
    const email = req.body.email;
    const nickname = req.body.nickname;

    const newUser = await userService.addUserWithKakao(email, nickname);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});
// 카카오 로그인
userRouter.post('/login/kakao', async function (req, res, next) {
  try {
    const email = req.body.email;

    const loginResult = await userService.getUserTokenWithKakao(email);

    res.status(200).json(loginResult);
  } catch (error) {
    next(error);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////

export { userRouter };
