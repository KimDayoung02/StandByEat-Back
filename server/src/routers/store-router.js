import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { storeService } from '../services';
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const storeRouter = Router();
// const DIR = 'src/db/image/';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});
const getSignedUrl = ({ key }) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: '<your bucket name>',
        Fields: {
          key /* ex) image/<파일 이름>.<jpeg or png> */,
        },
        Conditions: [
          ['content-length-range', 0, 50 * 1000 * 1000],
          ['starts-with', '$Content-Type', 'image/'],
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'standbyeat', // 버킷 이름 입력
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}}`);
    },
  }),
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   }, //file 을 받아와서 DIR 경로에 저장한다.
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// let upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     // 말 그대로 fileFilter
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png .jpg and .jpeg format allowed!'));
//     }
//   },
// });

// 상점등록 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
storeRouter.post('/store', upload.single('image'), async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    const picture = req.file.location;
    // req (request)의 body 에서 데이터 가져오기
    const storeName = req.body.storeName;
    const location = req.body.location;
    const categoryLocation = req.body.categoryLocation;
    const menu = req.body.menu;
    const phoneNumber = req.body.phoneNumber;
    const introduction = req.body.introduction;
    const openingHours = req.body.openingHours;
    const webSite = req.body.webSite;
    const maxPeopleCount = req.body.maxPeopleCount;
    const reservationTime = req.body.reservationTime;
    // const picture = url + '/db/image/'; /*req.file.filename*/
    const notice = req.body.notice;
    const tag = req.body.tag;
    const facilities = req.body.facilities;
    const latitude = req.body.latitude;
    const hardness = req.body.hardness;

    // 위 데이터를 유저 db에 추가하기
    const newStore = await storeService.addStore({
      storeName,
      location,
      categoryLocation,
      menu,
      phoneNumber,
      introduction,
      openingHours,
      webSite,
      maxPeopleCount,
      reservationTime,
      picture,
      notice,
      tag,
      facilities,
      latitude,
      hardness,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newStore);
  } catch (error) {
    next(error);
  }
});

// 전체 상점 목록을 가져옴 (배열 형태임)
storeRouter.get('/stores', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const stores = await storeService.getStores();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
});

//상점 ID로 정보가져오기
storeRouter.get('/store/:storeId', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const storeId = req.params.storeId;

    const getId = await storeService.getStoreId(storeId);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(getId);
  } catch (error) {
    next(error);
  }
});

// 상점 정보 수정
// (예를 들어 /api/store/abc12345 로 요청하면 req.params.storeId는 'abc12345' 문자열로 됨)
storeRouter.patch('/store/:storeId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    // params로부터 id를 가져옴
    const storeId = req.params.storeId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const storeName = req.body.storeName;
    const location = req.body.location;
    const categoryLocation = req.body.categoryLocation;
    const menu = req.body.menu;
    const phoneNumber = req.body.phoneNumber;
    const introduction = req.body.introduction;
    const openingHours = req.body.openingHours;
    const webSite = req.body.webSite;
    const maxPeopleCount = req.body.maxPeopleCount;
    const reservationTime = req.body.reservationTime;
    const picture = req.body.picture;
    const notice = req.body.notice;
    const tag = req.body.tag;
    const facilities = req.body.facilities;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(storeName && { storeName }),
      ...(location && { location }),
      ...(categoryLocation && { categoryLocation }),
      ...(menu && { menu }),
      ...(phoneNumber && { phoneNumber }),
      ...(introduction && { introduction }),
      ...(openingHours && { openingHours }),
      ...(webSite && { webSite }),
      ...(maxPeopleCount && { maxPeopleCount }),
      ...(reservationTime && { reservationTime }),
      ...(picture && { picture }),
      ...(notice && { notice }),
      ...(tag && { tag }),
      ...(facilities && { facilities }),
    };

    // 사용자 정보를 업데이트함.
    const updatedStoreInfo = await storeService.setStore(storeId, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedStoreInfo);
  } catch (error) {
    next(error);
  }
});

// 선택 상품 삭제
storeRouter.delete('/store/:storeId', async function (req, res, next) {
  try {
    // 상품 Id 얻음
    const storeId = req.params.storeId;
    const deletestore = await storeService.DeleteStore(storeId);
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(deletestore);
  } catch (error) {
    next(error);
  }
});

export { storeRouter };
