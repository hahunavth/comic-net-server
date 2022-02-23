// @ts-ignore
import corsAnyware from "cors-anywhere";
// declare module 'cors-anywhere'
import axios from "axios";
import { Request, Response, NextFunction } from "express";

import Model from "../models/index.js";
import { FindComicProps } from "../../constants.js";

const proxy = corsAnyware.createServer({
  setHeaders: {
    referer: "https://www.nettruyenpro.com",
  },
});

class Controller {
  static async test(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = await axios.get("http://www.nettruyenpro.com/");
      res.status(200).json({ message: "sucessfully!", data });
    } catch (error) {
      next(error);
      res.status(500).json({ err: error });
    }
  }

  static async getRecentUpdated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { pagination, page, limit, offset } = res.locals;

      const list = await Model.RecentUpdate(page);

      console.log(list?.length);
      res.status(200).json({
        success: true,
        pagination: {
          page,
          limit,
        },
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTopComicMonth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const { pagination, page, limit, offset } = res.locals;

      const list = await Model.getTopComicMonth();

      res.status(200).json({
        success: true,
        pagination: {
          // page, limit
        },
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeComment(req: Request, res: Response, next: NextFunction) {
    try {
      // const { pagination, page, limit, offset } = res.locals;

      const list = await Model.getHomeComment();

      res.status(200).json({
        success: true,
        pagination: {
          //   page, limit
        },
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHotPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = res.locals;
      // const { offset } = pageToPagination(_page);

      const list = await Model.getHotPage(page);

      res.status(200).json({
        success: true,
        pagination: {
          // page, limit
        },
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComicPage(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("aaaaaaa");
      // if (req.body) return res.status(400).json({});
      const path = req.body?.path || req.params.id;
      console.log(path);
      const result = await Model.getComicPage(
        path
          ? "/truyen-tranh/" + path
          : "/truyen-tranh/kaii-to-otome-to-kamigakushi-51987"
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getComicComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const path = req.body?.path || req.params.id;
      const result = await Model.getComicComment(path);
      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findComicPage(req: Request, res: Response, next: NextFunction) {
    try {
      const params: {
        [k in keyof FindComicProps]?: any;
      } = req.query;
      const { pagination, page, limit, offset } = res.locals;

      const result = await Model.FindComic({
        gender: params.gender,
        genres: params.genres,
        minchapter: params.minchapter,
        sort: params.sort,
        status: params.status,
        page,
      });
      return res.status(200).json({ data: (result && result[0]) || [] });
    } catch (error) {
      next(error);
    }
  }

  // TODO: PAGINATE RESPONSE
  static async getChapterPage(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.path);
      const data = await Model.getChapterPage(req.path);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async findComicByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.query;
      const { pagination, page, limit, offset } = res.locals;

      if (typeof name === "string") {
        const list = await Model.getComicByName(name, page);
        return res.status(200).json({
          success: true,
          pagination: {
            pagination,
            page,
            limit,
            offset,
          },
          data: list,
        });
      }
      res.status(400).json({
        message: "not found",
      });
    } catch (error) {
      next(error);
    }
  }

  static async corsAnywhere(req: Request, res: Response) {
    req.url = req.url.replace("/cors/", "/");
    console.log(req.body);
    proxy.emit("request", req, res);
  }
}

export default Controller;
