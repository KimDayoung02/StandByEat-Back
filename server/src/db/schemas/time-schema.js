import { Schema } from 'mongoose';

const TimeSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'store',
    required: true,
  },
  maxNumberOfReservations: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: false,
    default: 0,
  },
});

export { TimeSchema };
