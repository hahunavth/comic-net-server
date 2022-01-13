export declare const API_URL = "https://hahunavth-express-api.herokuapp.com/api/v1/";
export declare type ApiRespone_T<T> = {
    data: T;
    success?: string;
    paginate?: {
        page: number;
        limit: number;
    };
};
export declare type queryGen_T<T> = {
    [K in keyof T]: unknown;
};
export declare type resComicItem_T = {
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
export declare type resComicDetail_T = {
    path: string;
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
    chapters: resComicDetailChapterItem_T[];
};
export declare type resComicDetailChapterItem_T = {
    name: string;
    updatedAt: string;
    url: string;
    path: string;
    updatedDistance: string;
    updatedVew: string;
    "data-id": number;
};
export declare type resChapterDetail_T = {
    title: string;
    path: string;
    chapterName: string;
    updatedAt: string;
    updatedDistance: string;
    images: string[];
    chapterList: any[];
};
