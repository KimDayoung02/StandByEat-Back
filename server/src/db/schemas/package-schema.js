import { Schema } from "mongoose";

const PackageSchema = new Schema({
  packageName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  departureAt: {
    type: Date,
    required: true,
  },
  arrivalAt: {
    type: Date,
    required: true,
  },
  totalNumber: {
    type: Number,
    required: true,
  },
  countNumber: {
    type: Number,
    required: false,
    default: 0,
  },
  imgUrl: {
    type: String,
    required: false,
  },
  substance: {
    type: String,
    required: false,
  },
});

export { PackageSchema };
