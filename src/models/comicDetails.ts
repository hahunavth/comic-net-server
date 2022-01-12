import mongoose from "mongoose";
import { resComicDetail_T } from "../utils/api";

const comicDetailSchema = new mongoose.Schema<
  resComicDetail_T & { _id: "string" }
>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    path: String,
    title: String,
    posterUrl: String,
    status: String,
    author: String,
    kind: [String],
    info: String,
    rate: String,
    views: String,
    follows: String,
    detail: String,
    id: String,
    // chapters: resComicDetailChapterItem_T[];
    // chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ComicDetails", comicDetailSchema);
