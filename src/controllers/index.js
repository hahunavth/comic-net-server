import corsAnyware from "cors-anywhere";
import axios from "axios";

import Model from "../models/index.js";

const proxy = corsAnyware.createServer({
  setHeaders: {
    referer: "https://www.nettruyenpro.com",
  },
});

class Controller {
  static async test(req, res, next) {
    try {
      const { data } = await axios.get("http://www.nettruyenpro.com/");
      res.status(200).json({ message: "sucessfully!", data });
    } catch (error) {
      next(error);
      res.status(500).json({ err: error });
    }
  }

  static async getRecentUpdated(req, res, next) {
    try {
      const { pagination, page, limit, offset } = res.locals;

      const list = await Model.RecentUpdate(page, limit);

      console.log(list?.length);
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  }

  static async getHotPage(req, res, next) {
    try {
      const { _page } = req.query;
      // const { offset } = pageToPagination(_page);

      const list = (await Model.getHotPage(_page))[0];

      console.log(list.length);
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  }

  static async getComicPage(req, res, next) {
    try {
      // console.log("aaaaaaa");
      // if (req.body) return res.status(400).json({});
      let path = req.body?.path || req.params.id;
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

  static async findComicPage(req, res, next) {
    try {
      const { genres, minchapter, status } = req.query;
      const statusList = [
        { name: "Dang tien hanh", id: 1 },
        { name: "da hoan thanh", id: 2 },
        { name: "Tat ca", id: -1 },
      ];
      console.log(genresIds);
      const result = await Model.FindComic();
      return res.status(200).json(result[0]);
    } catch (error) {
      next(error);
    }
  }

  static async getChapterPage(req, res, next) {
    try {
      // console.log(req.path);
      const data = await Model.getChapterPage(req.path);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async corsAnywhere(req, res) {
    req.url = req.url.replace("/cors/", "/");
    proxy.emit("request", req, res);
  }
}

export default Controller;
