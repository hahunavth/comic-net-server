import mongoose from "mongoose";
export declare type ComicLogT = {
    _id: mongoose.Types.ObjectId;
    path: string;
    max: number;
    from: number;
    to: number;
    sucCount: number;
    errCount: number;
    errPaths: string[];
};
declare const _default: mongoose.Model<ComicLogT, {}, {}, {}>;
export default _default;
