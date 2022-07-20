import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    pw: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    birth: {
      type: Date,
      required: false,
      default: "",
    },
    profileImgUrl: {
      type: String,
      required: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export { UserSchema };
