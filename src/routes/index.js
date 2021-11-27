import express from "express";
import Controller from "../controllers/index.js";
import paginate from "../middlewares/paginate.js";

const Router = express.Router();

// home page
Router.get("/recently/", paginate ,Controller.getRecentUpdated);
Router.get("/hot/", Controller.getHotPage);

// comic page
Router.get("/truyen-tranh/:id", Controller.getComicPage);

// chapter page
Router.get("/truyen-tranh/:id/:chapterId/:hash", Controller.getChapterPage);

// find page
Router.get("/find/", Controller.findComicPage);

// image
Router.get("/cors/:proxyUrl*", Controller.corsAnywhere);

// test
Router.get("/test", Controller.test);

export default Router;
