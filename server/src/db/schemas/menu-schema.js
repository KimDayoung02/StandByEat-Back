import { Schema } from 'mongoose';

const MenuSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'store',
    required: true,
  },
  menuName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
});

export { MenuSchema };
