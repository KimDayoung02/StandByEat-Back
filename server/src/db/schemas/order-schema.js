import { Schema } from 'mongoose';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
  reservationTime: {
    type: String,
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
