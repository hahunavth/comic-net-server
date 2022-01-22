import mongoose from "mongoose";
import { resComicDetail_T } from "../utils/api";

export type ComicLogT = {
  _id: mongoose.Types.ObjectId;
  path: string;
  max: number;
  from: number;
  to: number;
  sucCount: number;
  errCount: number;
  errPaths: string[];
};

const comicLogSchema = new mongoose.Schema<ComicLogT>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    path: String,
    max: Number,
    from: Number,
    to: Number,
    sucCount: Number,
    errCount: Number,
    errPaths: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ComicLog", comicLogSchema);
