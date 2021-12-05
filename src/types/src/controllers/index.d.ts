import { Request, Response, NextFunction } from 'express';
declare class Controller {
    static test(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRecentUpdated(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTopComicMonth(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHomeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHotPage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getComicPage(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getComicComment(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static findComicPage(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getChapterPage(req: Request, res: Response, next: NextFunction): Promise<void>;
    static corsAnywhere(req: Request, res: Response): Promise<void>;
}
export default Controller;
