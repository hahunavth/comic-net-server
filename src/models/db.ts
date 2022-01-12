import mongoose from "mongoose";

import Comic from "./comic";
import ComicDetails from "./comicDetails";
import ComicDetailChapterItem from "./comicDetailChapterItem";
mongoose.Promise = global.Promise;

const db: any = {};

// db.User = User;
// db.Role = Role;
// db.ROLES = ["user", "admin", "moderator"];

db.Comic = Comic;
db.ComicDetails = ComicDetails;
db.ComicDetailChapterItem = ComicDetailChapterItem;

// db.File = File;

export default db;
