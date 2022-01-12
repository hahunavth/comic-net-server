import mongoose from "mongoose";

const comicDetailChapterItemSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    updatedAt: String,
    url: String,
    path: String,
    updatedDistance: String,
    updatedVew: String,
    // chapters: resComicDetailChapterItem_T[];
    // chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ComicDetailsChapterItem",
  comicDetailChapterItemSchema
);
