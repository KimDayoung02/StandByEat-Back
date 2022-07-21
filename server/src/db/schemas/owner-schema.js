import { Schema } from "mongoose";

const OwnerSchema = new Schema(
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
    location: {
      type: String,
      required: false,
    },
    store: {
      type: Array,
      required: false,
    },
    profileImg: {
      type: String,
      required: false,
    },
  },
  {
    collection: "owners",
    timestamps: true,
  }
);

export { OwnerSchema };
