import corsAnyware from "cors-anywhere";
// declare module 'cors-anywhere'
import axios from "axios";
import {Request, Response, NextFunction} from 'express'

import Model from "../models/index.js";

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

  static async getRecentUpdated(req: Request, res: Response, next: NextFunction) {
    try {
      const { pagination, page, limit, offset } = res.locals;

      const list = await Model.RecentUpdate(page);

      console.log(list?.length);
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  }

  static async getHotPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { _page } = req.query;
      // const { offset } = pageToPagination(_page);

      const list = (await Model.getHotPage())[0];

      console.log(list.length);
      res.status(200).json(list);
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

  static async findComicPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { genres, minchapter, status } = req.query;
      const statusList = [
        { name: "Dang tien hanh", id: 1 },
        { name: "da hoan thanh", id: 2 },
        { name: "Tat ca", id: -1 },
      ];
      const result = await Model.FindComic();
      return res.status(200).json(result[0]);
    } catch (error) {
      next(error);
    }
  }

  static async getChapterPage(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.path);
      const data = await Model.getChapterPage(req.path);
      res.status(200).json(data);
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
