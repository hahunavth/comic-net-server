import { FindComicProps } from "../../constants.js";
import { resComicSuggestSearchT } from "../utils/api.js";
/**
 * Fetch data model
 */
declare class Model {
    static RecentUpdate(page: number): Promise<{
        list: {
            views: number;
            follows: number;
            kind?: string[] | undefined;
            author?: string | undefined;
            anotherName?: string | undefined;
            status?: string | undefined;
            updateAt?: string | undefined;
            updatedDistance?: string | undefined;
            name?: string | undefined;
            posterUrl?: string | undefined;
            path?: string | undefined;
            id?: string | undefined;
            lastedChapters?: [{
                chapterName: string;
                chapterUrl: string;
                updatedAt: string;
                updatedDistance: string;
            }] | undefined;
        }[];
        pagination: Paginate;
    } | undefined>;
    static getTopComicMonth(): Promise<any>;
    static getHomeComment(): Promise<any>;
    static getHotPage(page?: number): Promise<{
        list: {
            views: number;
            follows: number;
            kind?: string[] | undefined;
            author?: string | undefined;
            anotherName?: string | undefined;
            status?: string | undefined;
            updateAt?: string | undefined;
            updatedDistance?: string | undefined;
            name?: string | undefined;
            posterUrl?: string | undefined;
            path?: string | undefined;
            id?: string | undefined;
            lastedChapters?: [{
                chapterName: string;
                chapterUrl: string;
                updatedAt: string;
                updatedDistance: string;
            }] | undefined;
        }[];
        pagination: Paginate;
    } | undefined>;
    static getComicPage(path: string): Promise<{
        path: any;
        title: any;
        author: any;
        posterUrl: any;
        status: any;
        kind: any;
        info: any;
        rate: any;
        views: any;
        follows: any;
        detail: any;
        chapters: any;
    } | undefined>;
    static FindComic(param: FindComicProps): Promise<{
        list: {
            views: number;
            follows: number;
            kind?: string[] | undefined;
            author?: string | undefined;
            anotherName?: string | undefined;
            status?: string | undefined;
            updateAt?: string | undefined;
            updatedDistance?: string | undefined;
            name?: string | undefined;
            posterUrl?: string | undefined;
            path?: string | undefined;
            id?: string | undefined;
            lastedChapters?: [{
                chapterName: string;
                chapterUrl: string;
                updatedAt: string;
                updatedDistance: string;
            }] | undefined;
        }[];
        pagination: Paginate;
    } | undefined>;
    static getChapterPage(path: string): Promise<any>;
    static getComicComment(path: string, page?: number): Promise<{
        comment: any;
        pager: any;
    } | undefined>;
    static getComicByName(name: string, page: number): Promise<{
        list: {
            views: number;
            follows: number;
            kind?: string[] | undefined;
            author?: string | undefined;
            anotherName?: string | undefined;
            status?: string | undefined;
            updateAt?: string | undefined;
            updatedDistance?: string | undefined;
            name?: string | undefined;
            posterUrl?: string | undefined;
            path?: string | undefined;
            id?: string | undefined;
            lastedChapters?: [{
                chapterName: string;
                chapterUrl: string;
                updatedAt: string;
                updatedDistance: string;
            }] | undefined;
        }[];
        pagination: Paginate;
    } | undefined>;
    static suggestSearch(name: string, page?: number): Promise<resComicSuggestSearchT>;
}
declare type Paginate = {
    page: number | string;
    max: number | string;
};
export declare type queryOne_T = {
    selector?: string;
    selectorAll?: string;
    attribute: string;
    customSelector?: boolean;
    callback?: (a: any) => any;
};
export declare type queryO_T = {
    [key: string | number]: queryOne_T;
};
export declare type queryA_T = queryOne_T[];
declare type gCallback_T = (a: any, b: any, c?: any, d?: any) => any;
export declare function parseListGen(html: string, query: queryO_T | queryA_T, callback: gCallback_T): any;
export default Model;
