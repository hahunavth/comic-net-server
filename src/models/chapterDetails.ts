import mongoose from "mongoose";
import { resChapterDetail_T } from "../utils/api";

const chapterDetailSchema = new mongoose.Schema<
  resChapterDetail_T & {
    _id: string;
    comicPath: string;
  }
>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    path: String,
    title: String,
    comicPath: String,
    chapterName: String,
    updatedAt: String,
    updatedDistance: String,
    images: [String],
    // chapters: resComicDetailChapterItem_T[];
    // chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChapterDetails", chapterDetailSchema);
