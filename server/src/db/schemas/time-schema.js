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
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
});

export { TimeSchema };
