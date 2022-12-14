import cors from 'cors';
import express from 'express';
let http = require('http');
let path = require('path');

import {
  userRouter,
  storeRouter,
  orderRouter,
  adminRouter,
  ownerRouter,
  reviewRouter,
  commonRouter,
  timeRouter,
  menuRouter,
} from './routers';

import { errorHandler } from './middlewares';
import { orderModel } from './db';

const app = express();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.

app.use('/user', userRouter);

app.use('/admin', adminRouter);
app.use('/owner', ownerRouter);
app.use('/review', reviewRouter);

app.use('/api', storeRouter);
app.use('/api', orderRouter);
app.use('/common', commonRouter);

app.use('/api', storeRouter);
app.use('/api', orderRouter);
app.use('/api', timeRouter);
app.use('/api', menuRouter);

let publicPath = path.resolve(__dirname, 'image');

app.use('/', express.static('src'));

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨

export { app };
