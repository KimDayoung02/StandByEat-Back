import { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
      index: true,
    },
    reviewScore: {
      type: Number,
      required: false,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    reviewImgUrl: {
      type: String,
      required: false,
    },
    reviewRegisterTime: {
      type: Date,
      required: false,
    },
    reviewContent: {
      type: String,
      required: false,
    },
  }
  // {
  //   collection: "review",
  //   timestamps: true,
  // }
);

export { ReviewSchema };
