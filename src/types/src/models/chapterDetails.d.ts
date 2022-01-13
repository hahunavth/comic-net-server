import mongoose from "mongoose";
import { resChapterDetail_T } from "../utils/api";
declare const _default: mongoose.Model<resChapterDetail_T & {
    _id: string;
    comicPath: string;
    updated_at: string;
}, {}, {}, {}>;
export default _default;
