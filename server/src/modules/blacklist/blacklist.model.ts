import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklist extends Document {
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const blacklistSchema = new Schema<IBlacklist>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "BlackLists",
  }
);

const BlackListModel = mongoose.model<IBlacklist>(
  "BlackLists",
  blacklistSchema
);

export default BlackListModel;
