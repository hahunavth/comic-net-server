import cron from "node-cron";
import Model from "../models/index.js";
import Comic from "../models/comic.js";
import ChapterDetails from "../models/chapterDetails.js";
import mongoose from "mongoose";
import { getComicSlug } from "../utils/index.js";
import { resComicDetailChapterItem_T, resComicItem_T } from "../utils/api.js";
import ComicDetails from "../models/comicDetails.js";
import pLimit from "p-limit";

let _lock = false;
let _fetchListStt: {
  path: string;
  max: number;
  from: number;
  to: number;
  sucCount: number;
  errCount: number;
}[] = [];

export default function Task() {
  cron.schedule("*/10 * * * *", () => {
    if (_lock === false) {
      findAndSaveComic();
    }
  });
  // findAndSaveComic();
}

// SaveData();
const limit = pLimit(3);
async function findAndSaveComic() {
  _lock = true;
  // Get recent list in first page
  const comicList: any[] = await Model.RecentUpdate(1);
  console.log(`🚀🚀 - Fetch comic list: ${comicList.length}`);

  const promises = comicList.map((comic) => limit(() => crawlItem(comic)));
  // Save comic detail
  await Promise.allSettled(promises);
  console.log("END");
  _lock = false;
}

const crawlItem = async (comicItem: resComicItem_T) => {
  const comic = new Comic({
    ...comicItem,
    _id: new mongoose.Types.ObjectId(),
  });
  // Find comic
  const result = await Comic.findOne({ path: comic.path });

  if (!result) {
    comic.save().then((c) => console.log("🚀🚀 - Save comic: " + c.path));
  } else {
    // console.log("🚀🚀 - Found comic: " + comic.path);
  }

  // Comic Detail
  const comicPagePath = comicItem.path
    ? await Model.getComicPage(comicItem.path)
    : null;

  // console.log("🚀🚀 - Fetch comic detail: " + comicPagePath?.path);
  if (comicPagePath) {
    const comicDetail = new ComicDetails({
      ...comicPagePath,
      _id: new mongoose.Types.ObjectId(),
    });
    const comicDetailSaved = await ComicDetails.findOne({
      path: comic.path,
    });
    // console.log("🚀🚀 - Found comic detail: " + comicDetailSaved?.path);
    if (!comicDetailSaved) {
      comicDetail.save();
      // .then((cd) => console.log("🚀🚀 - Save comic detail: " + cd.path));
    }

    // Find chapters need save
    let _cptListPosition = -1;
    // console.log(comicPagePath.author);
    const _cptListLength = comicPagePath.chapters?.length;
    const _cptList: resComicDetailChapterItem_T[] = comicPagePath.chapters;
    const savedLastedChapter = await ChapterDetails.find()
      .sort({ createdAt: -1 })
      .findOne({
        comicPath: comicPagePath.path,
      });
    console.log(
      "🚀🚀 - Find lasted chapter: " + savedLastedChapter?.path,
      comicPagePath.chapters[0].path
    );

    if (savedLastedChapter?.path) {
      // console.log(_cptListLength);
      for (let i = 0; i < _cptListLength; i++) {
        if (_cptList[i].path === savedLastedChapter.path) {
          _cptListPosition = i;
          console.log("set " + i + " " + savedLastedChapter.path);
          break;
        }
      }
    }

    // Save chapterDetail
    console.log(
      "🚀🚀🚀🚀🚀🚀 - Fetch chapter from: [0.." +
        (_cptListPosition === -1 ? _cptListLength - 1 : _cptListPosition - 1) +
        "] / " +
        _cptListLength
    );
    for (
      let i =
        _cptListPosition === -1 ? _cptListLength - 1 : _cptListPosition - 1;
      i >= 0;
      i--
    ) {
      const chapterDetail = await Model.getChapterPage(_cptList[i]?.path);
      if (!comicDetail) {
        console.log("Fetch failed::::: " + _cptList[i]?.path + " >>> break;");
        break;
      }
      // console.log("🚀🚀 - Fetch chapter: " + chapterDetail.path);
      // const chapterDetailInstance = new ChapterDetails({
      //   ...chapterDetail,
      //   updatedAt: undefined,
      //   updated_at: chapterDetail.updatedAt,
      //   _id: new mongoose.Types.ObjectId(),
      //   comicPath: comicPagePath.path,
      // });

      await ChapterDetails.findOneAndUpdate(
        { path: chapterDetail.path },
        {
          ...chapterDetail,
          updatedAt: undefined,
          updated_at: chapterDetail.updatedAt,
          comicPath: comicPagePath.path,
          // _id: new mongoose.Types.ObjectId(),
        },
        { upsert: true, new: true }
      )
        .then((a) => {
          console.log("Save Chapter: " + a?.path + " " + chapterDetail.path);
        })
        .catch((err) => console.log("Save Chapter Fail::: ", err?.message));
    }
  }
};
