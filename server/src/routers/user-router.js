import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, errorHandler } from "../middlewares";
import { userService } from "../services";
import { body, validationResult } from "express-validator";

const userRouter = Router();

const validationFunc = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  next();
};

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post(
  "/register",
  [
    body("name", "이름을 입력해 주세요.").trim().notEmpty(),

    body("pw", "패스워드는 4자리 이상으로 입력해주세요.")
      .trim()
      .isLength({ min: 4 }),

    validationFunc,
  ],
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
      const id = req.body.id;
      const pw = req.body.pw;
      const name = req.body.name;
      // const email = req.body.email;
      const phoneNumber = req.body.phoneNumber;
      // const telNumber = req.body.telNumber;
      const nickName = req.body.nickName;
      const location = req.body.location;
      const birth = req.body.birth;
      const profileImgUrl = `https://avatars.dicebear.com/api/identicon/${req.body.email}.svg`;
      // const gender = req.body.gender;
      // const profileImgUrl = `https://avatars.dicebear.com/api/identicon/${req.body.email}.svg`;

      // 위 데이터를 유저 db에 추가하기
      const newUser = await userService.addUser({
        id,
        // email,
        pw,
        name,
        phoneNumber,
        // telNumber,
        nickName,
        location,
        birth,
        profileImgUrl,
        // gender,
        // profileImgUrl,
      });

      // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
      // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  errorHandler
);

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
// userRouter.post(
//   '/login',
//   async function (req, res, next) {
//     try {
//       // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
//       if (is.emptyObject(req.body)) {
//         throw new Error(
//           'headers의 Content-Type을 application/json으로 설정해주세요'
//         );
//       }

//       // req (request) 에서 데이터 가져오기
//       const email = req.body.email;
//       const password = req.body.password;

//       // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
//       const userToken = await userService.getUserToken({ email, password });

//       // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
//       res.status(200).json(userToken);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 전체 유저 목록을 가져옴 (배열 형태임)
// // 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
// userRouter.get(
//   '/users',

//   async function (req, res, next) {
//     try {
//       // 전체 사용자 목록을 얻음
//       const users = await userService.getUsers(req.query);
//       // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
//       res.status(200).json(users);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 휴대폰 번호로 유저 데이터 가져옴
// // 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
// userRouter.get(
//   '/userphone/:phoneNumber',
//   async function (req, res, next) {
//     try {
//       // 전체 사용자 목록을 얻음
//       const phoneNumber = req.params.phoneNumber;

//       const userPhone = await userService.getPhoneNumber(phoneNumber);

//       // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
//       res.status(200).json(userPhone);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
// userRouter.get(
//   '/useremail/:email',
//   async function (req, res, next) {
//     try {
//       // 전체 사용자 목록을 얻음
//       const email = req.params.email;
//       const user = await userService.getUserByEmail(email);

//       // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
//       res.status(200).json(user);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// userRouter.get(
//   '/usertel/:telNumber',
//   async function (req, res, next) {
//     try {
//       // 전체 사용자 목록을 얻음
//       const telNumber = req.params.telNumber;

//       const userTel = await userService.getTelNumber(telNumber);

//       // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
//       res.status(200).json(userTel);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 사용자 정보 수정
// // (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
// userRouter.patch(
//   '/user/:userId',
//   loginRequired,
//   async function (req, res, next) {
//     try {
//       // content-type 을 application/json 로 프론트에서
//       // 설정 안 하고 요청하면, body가 비어 있게 됨.
//       if (is.emptyObject(req.body)) {
//         throw new Error(
//           'headers의 Content-Type을 application/json으로 설정해주세요'
//         );
//       }

//       // params로부터 id를 가져옴
//       const userId = req.params.userId;

//       // body data 로부터 업데이트할 사용자 정보를 추출함.
//       const fullName = req.body.fullName;
//       const password = req.body.password;
//       const address = req.body.address;
//       const phoneNumber = req.body.phoneNumber;
//       const telNumber = req.body.telNumber;
//       const role = req.body.role;

//       // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
//       const currentPassword = req.body.currentPassword;

//       // currentPassword 없을 시, 진행 불가
//       if (!currentPassword) {
//         throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
//       }

//       const userInfoRequired = { userId, currentPassword };

//       // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
//       // 보내주었다면, 업데이트용 객체에 삽입함.
//       const toUpdate = {
//         ...(fullName && { fullName }),
//         ...(password && { password }),
//         ...(address && { address }),
//         ...(phoneNumber && { phoneNumber }),
//         ...(telNumber && { telNumber }),
//         ...(role && { role }),
//       };

//       // 사용자 정보를 업데이트함.
//       const updatedUserInfo = await userService.setUser(
//         userInfoRequired,
//         toUpdate
//       );

//       // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
//       res.status(200).json(updatedUserInfo);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 관리자 권한 수정
// // (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
// userRouter.patch(
//   '/useradmin/:userId',
//   async function (req, res, next) {
//     try {
//       // content-type 을 application/json 로 프론트에서
//       // 설정 안 하고 요청하면, body가 비어 있게 됨.
//       if (is.emptyObject(req.body)) {
//         throw new Error(
//           'headers의 Content-Type을 application/json으로 설정해주세요'
//         );
//       }

//       // params로부터 id를 가져옴
//       const userId = req.params.userId;

//       // body data 로부터 업데이트할 사용자 정보를 추출함.
//       const role = 'admin';

//       // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.

//       // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
//       // 보내주었다면, 업데이트용 객체에 삽입함.
//       const admintoUpdate = {
//         ...(role && { role }),
//       };

//       // 사용자 정보를 업데이트함.
//       const updatedUseradmin = await userService.setAdmin(
//         userId,
//         admintoUpdate
//       );

//       // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
//       res.status(200).json(updatedUseradmin);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

// // 사용자 삭제
// userRouter.delete(
//   '/user',
//   async function (req, res, next) {
//     try {
//       // 상품 Id 얻음
//       const userId = req.body.userId;
//       const userPassword = req.body.password;
//       const inputPassword = req.body.passwordConfirmInput;
//       const deleteuser = await userService.DeleteUser(
//         userId,
//         userPassword,
//         inputPassword
//       );
//       res.status(200).json(deleteuser);
//     } catch (error) {
//       next(error);
//     }
//   },
//   errorHandler
// );

export { userRouter };
