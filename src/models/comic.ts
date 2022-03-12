import mongoose from "mongoose";
import { resComicItem_T } from "../utils/api";

const comicSchema = new mongoose.Schema<resComicItem_T & { _id: "string" }>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    kind: [String],
    author: String,
    anotherName: String,
    status: String,
    views: Number,
    follows: Number,
    updateAt: String,
    updatedDistance: String,
    name: String,
    posterUrl: String,
    path: String,
    id: String,
    lastedChapters: [
      {
        chapterName: String,
        chapterUrl: String,
        updatedAt: String,
        updatedDistance: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comic", comicSchema);
