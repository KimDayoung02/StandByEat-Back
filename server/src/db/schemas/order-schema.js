import { Schema } from "mongoose";

const OrderSchema = new Schema({
  // 유저 오브젝트
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  // 가게 오브젝트
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "store",
    required: true,
  },
  numberOfReservations: {
    type: Number,
    required: false,
  },
  fee: {
    type: Number,
    required: false,
    default: 0,
  },
  requirements: {
    type: String,
    required: false,
  },
  // 예약 날짜
  date: {
    type: String,
    required: true,
  },
  // 예약 시간
  time: {
    type: String,
    required: true,
  },
  // 에약 인원
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  timeId: {
    type: Schema.Types.ObjectId,
    ref: "time",
    required: false,
  },
});

export { OrderSchema };
