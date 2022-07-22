import { Schema } from 'mongoose';

const StoreSchema = new Schema(
  {
    storeName: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    categoryLocation: {
      type: String,
      required: false,
    },
    menu: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    introduction: {
      type: String,
      required: false,
    },
    openingHours: {
      type: String,
      required: false,
    },
    webSite: {
      type: String,
      required: false,
    },
    maxPeopleCount: {
      type: Number,
      required: false,
      default: 0,
    },
    reservationTime: {
      type: Array,
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    notice: {
      type: String,
      required: false,
    },
    tag: {
      type: Array,
      required: false,
    },
    facilities: {
      type: Array,
      required: false,
    },
    latitude: {
      type: String,
      required: false,
    },
    hardness: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export { StoreSchema };
