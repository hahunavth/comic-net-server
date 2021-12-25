declare class Model {
    static RecentUpdate(page: number): Promise<any>;
    static getTopComicMonth(): Promise<any>;
    static getHomeComment(): Promise<any>;
    static getHotPage(page?: number): Promise<any>;
    static getComicPage(path: string): Promise<{
        path: any;
        title: any;
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
    static FindComic(): Promise<any>;
    static getChapterPage(path: string): Promise<any>;
    static getComicComment(path: string): Promise<{
        comment: any;
        pager: any;
    } | undefined>;
}
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
