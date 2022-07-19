import { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    pw: {
      type: String,
      required: true,
    }
  },
  {
    collection: "admins",
    timestamps: true,
  }
);

export { AdminSchema };
