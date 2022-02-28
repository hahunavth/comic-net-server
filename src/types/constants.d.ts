export declare const LIMIT = 24;
export declare const GENRES_LIST: string[];
export declare const NUM_CHAPTER: number[];
declare type KV = {
    key: number;
    value: string;
};
export declare const STATUS: KV[];
export declare const FOR_USER: KV[];
export declare const SORT_BY: KV[];
export declare type FindComicProps = {
    genres: number;
    minchapter: number;
    status: number;
    gender: number;
    sort: number;
    page?: number;
};
export declare function toIdList(ids: number[]): string;
export {};
