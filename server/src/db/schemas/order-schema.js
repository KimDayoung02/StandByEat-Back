import { Schema } from 'mongoose';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'store',
    required: true,
  },
  numberOfReservations: {
    type: Number,
    required: true,
  },
  timeId: {
    type: Schema.Types.ObjectId,
    ref: 'time',
    required: true,
  },
  fee: {
    type: Number,
    required: true,
    default: 0,
  },
  requirements: {
    type: String,
    required: false,
  },
});

export { OrderSchema };
