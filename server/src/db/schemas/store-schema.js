import { Schema } from 'mongoose';

const StoreSchema = new Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    categoryLocation: {
      type: String,
      required: false,
    },
    menu: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
      required: true,
    },
    hardness: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { StoreSchema };
