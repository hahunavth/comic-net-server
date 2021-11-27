declare class Model {
    static RecentUpdate(page: number): Promise<any>;
    static getHotPage(): Promise<any>;
    static getComicPage(path: string): Promise<any>;
    static FindComic(): Promise<any>;
    static getChapterPage(path: string): Promise<any>;
}
export default Model;
