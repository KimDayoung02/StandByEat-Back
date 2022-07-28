import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { menuService } from '../services';
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const menuRouter = Router();

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
      cb(null, `menu/${Date.now()}_${file.originalname}}`);
    },
  }),
});

// 메뉴등록 api
menuRouter.post('/menu', upload.single('picture'), async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.

    // req (request)의 body 에서 데이터 가져오기
    const { storeId, menuName, price, details } = req.body;

    const picture = req.file?.location;

    // 위 데이터를 유저 db에 추가하기
    const newMenu = await menuService.addMenu({
      storeId,
      menuName,
      price,
      details,
      picture,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newMenu);
  } catch (error) {
    next(error);
  }
});

// 전체 메뉴 목록을 가져옴 (배열 형태임)
menuRouter.get('/menus', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const menus = await menuService.getMenus(req.query);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(menus);
  } catch (error) {
    next(error);
  }
});

// 메뉴 정보 수정
// (예를 들어 /api/store/abc12345 로 요청하면 req.params.storeId는 'abc12345' 문자열로 됨)
menuRouter.patch(
  '/menu/:menuId',
  upload.single('picture'),
  async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      // if (is.emptyObject(req.body)) {
      //   throw new Error(
      //     'headers의 Content-Type을 application/json으로 설정해주세요'
      //   );
      // }
      // params로부터 id를 가져옴
      const menuId = req.params.menuId;
      const { storeId, menuName, price, details } = req.body;
      const picture = req.file.location;

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(storeId && { storeId }),
        ...(menuName && { menuName }),
        ...(price && { price }),
        ...(details && { details }),
        ...(picture && { picture }),
      };

      // 사용자 정보를 업데이트함.
      const updatedMenuInfo = await menuService.setMenu(menuId, toUpdate);
      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedMenuInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 선택 메뉴 삭제
menuRouter.delete('/menu/:menuId', async function (req, res, next) {
  try {
    // 상품 Id 얻음
    const menuId = req.params.menuId;
    const deletemenu = await menuService.DeleteMenu(menuId);
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(deletemenu);
  } catch (error) {
    next(error);
  }
});

export { menuRouter };
