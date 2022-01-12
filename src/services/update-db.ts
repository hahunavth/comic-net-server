import cron from "node-cron";
import Model from "../models/index.js";
import Comic from "../models/comic.js";
import ChapterDetails from "../models/chapterDetails.js";
import mongoose from "mongoose";
import { getComicSlug } from "../utils/index.js";
import {
  resComicDetailChapterItem_T,
  resComicDetail_T,
  resComicItem_T,
} from "../utils/api.js";
import ComicDetails from "../models/comicDetails.js";
import pLimit from "p-limit";

let __lock = false;

async function SaveData() {
  console.log("Schedule task: " + new Date().toUTCString());

  // Get recent list
  const comicList = await Model.RecentUpdate(1);
  const comic = new Comic({
    ...comicList[0],
    _id: new mongoose.Types.ObjectId(),
  });
  const comicDetails = comicList[0].path
    ? await Model.getComicPage(comicList[0].path)
    : null;
  if (comicDetails) {
    const comicDetail = new ChapterDetails(comicDetails);
  }
  // Find comic
  const result = await Comic.findOne({ path: comic.path });

  // If not found -> save comic
  if (!result) {
    console.log(`DB.SaveComic: ${comic.name}`);
    comic.save().then((a) => console.log(a));
    return;
  }

  // If found get lasted chapter
  if (result && result.path) {
    // lasted chapter url
    const lastedUrl = result.lastedChapters
      ? result.lastedChapters[0].chapterUrl
      : null;

    if (
      !(
        result.lastedChapters &&
        comic.lastedChapters &&
        result.lastedChapters[0].chapterUrl ===
          comic.lastedChapters[0].chapterUrl
      )
    ) {
      const comicDetails: resComicDetail_T | undefined =
        await Model.getComicPage(result.path);
      // comicDetails.chapters.forEach((value, index) => (value.url || value.url = lastedUrl));

      // if(comicDetails?.chapters.length) {
      //   return;
      // }

      const responseChapterLength: number = comicDetails?.chapters.length || 0;

      // Comic detail
      let lastedPosition: number = -1;
      for (
        let i = responseChapterLength ? responseChapterLength - 1 : 0;
        i >= 0;
        i--
      ) {
        if (comicDetails?.chapters[i].url === lastedUrl) {
          lastedPosition = i;
          break;
        }
      }

      // if (lastedPosition === -1) {
      for (
        let i = lastedPosition === -1 ? responseChapterLength : lastedPosition;
        i >= 0;
        i--
      ) {
        // const chapter = new comicDetails
      }
      // }
    }
  }

  console.log("Done");
}

export default function Task() {
  cron.schedule("*/1 * * * *", () => {
    if (__lock === false) {
      findAndSaveComic();
    }
  });
  // findAndSaveComic();
}

// SaveData();
const limit = pLimit(3);
async function findAndSaveComic() {
  __lock = true;
  // Get recent list in first page
  const comicList: any[] = await Model.RecentUpdate(1);
  console.log(`🚀🚀 - Fetch comic list: ${comicList.length}`);

  // comicList = comicList.filter((v, id) => {
  // return id === 2;
  // });
  // const comicPromiseList = new Array(3).fill(comicList).map(crawlItem);
  let promises = comicList.map((comic) => limit(() => crawlItem(comic)));
  // Save comic detail
  await Promise.allSettled(promises);
  console.log("END");
  __lock = false;
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
    console.log("🚀🚀 - Found comic: " + comic.path);
  }

  // Comic Detail
  const comicPagePath = comicItem.path
    ? await Model.getComicPage(comicItem.path)
    : null;

  console.log("🚀🚀 - Fetch comic detail: " + comicPagePath?.path);
  if (comicPagePath) {
    const comicDetail = new ComicDetails({
      ...comicPagePath,
      _id: new mongoose.Types.ObjectId(),
    });
    const comicDetailSaved = await ComicDetails.findOne({
      path: comic.path,
    });
    console.log("🚀🚀 - Found comic detail: " + comicDetailSaved?.path);
    if (!comicDetailSaved) {
      comicDetail
        .save()
        .then((cd) => console.log("🚀🚀 - Save comic detail: " + cd.path));
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
      "🚀🚀 - Find lasted chapter: " + savedLastedChapter?.chapterName
    );
    if (savedLastedChapter?.chapterName) {
      console.log(_cptListLength);
      for (let i = 0; i < _cptListLength; i++) {
        if (_cptList[i].name === savedLastedChapter.chapterName) {
          _cptListPosition = i;
          console.log("set " + i);
          break;
        }
        // console.log(_cptList[i].name);
      }
    }
    // Save chapterDetail
    console.log("Fetch chapter from: " + _cptListPosition);
    for (
      let i =
        _cptListPosition === -1 ? _cptListLength - 1 : _cptListPosition - 1;
      i >= 0;
      i--
    ) {
      const chapterDetail = await Model.getChapterPage(_cptList[i]?.path);
      console.log("🚀🚀 - Fetch chapter: " + chapterDetail.path);
      // console.log(chapterDetail);
      const chapterDetailInstance = new ChapterDetails({
        ...chapterDetail,
        _id: new mongoose.Types.ObjectId(),
        comicPath: comicPagePath.path,
      });
      // if not found chapter -> save
      // const chapterDetailSaved = await ChapterDetails.findOne({
      // comicPath: comicItem.path,
      // });
      // console.log("object" + chapterDetailSaved);
      // if (!chapterDetailSaved) {
      await chapterDetailInstance
        .save()
        .then((a) => {
          console.log("Save Chapter: " + a.comicPath);
        })
        .catch((e) => console.log(e));
      // } else {
      // console.log("Found chapter: " + chapterDetailSaved?.path);
      // }
    }
  }

  // If not found -> save comic
  // if (!result) {
  //   console.log(`DB.SaveComic: ${comic.name}`);
  //   comic.save().then((a) => console.log(a));
  //   return;
  // }
};
