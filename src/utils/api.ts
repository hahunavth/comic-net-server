import { queryA_T, queryOne_T, queryO_T } from "../models";

export const API_URL =  "https://hahunavth-express-api.herokuapp.com/api/v1/"

export type ApiRespone_T<T> = {
  data: T,
  success?: string;
  paginate?: {
    page: number,
    limit: number
  }
}

export type queryGen_T<T> = {
  [K in keyof T]: unknown
}

// "https://hahunavth-express-api.herokuapp.com/api/v1/recently"
// ApiRespone_T<resComicItem_T>
export type resComicItem_T = {
  kind?: string[];
  author?: string;
  anotherName?: string;
  status?: string;
  views?: string;
  follows?: string;
  updateAt?: string;
  updatedDistance?: string;
  name?: string;
  posterUrl?: string;
  path?: string;
  id?: string;
  lastedChapters?: [
    {
      chapterName: string;
      chapterUrl: string;
      updatedAt: string;
      updatedDistance: string;
    }
  ];
};

// "https://hahunavth-express-api.herokuapp.com/api/v1/" + params.path

export type resComicDetail_T = {
  title: string;
  posterUrl: string;
  status: string;
  author: string;
  kind: string[];
  info: string;
  rate: string;
  views: string;
  follows: string;
  detail: string;
  id?: string;
  chapters: resComicDetailChapterItem_T[],
};

export type resComicDetailChapterItem_T = {
  name: string;
  updatedAt: string;
  url: string;
  path: string;
  updatedDistance: string;
  updatedVew: string; // NOTE: api forgot name
}

// "https://hahunavth-express-api.herokuapp.com/api/v1/" + path.path
// /truyen-tranh/{id}/{chapterId}/{hash}
// ApiRespone_T<resChapterDetail_T>
export type resChapterDetail_T = {
    "title": string,
    "chapterName": string,
    "updatedAt": string,
    "updatedDistance": string,
    "images": string[],
    "chapterList": any[]
}