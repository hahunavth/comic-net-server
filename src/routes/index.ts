import express from "express";
import Controller from "../controllers/index.js";
import paginate from "../middleware/paginate.js";

const Router = express.Router();

/**
 * @swagger
 * /recently:
 *   get:
 *     summary: Retrieve a list of comic card info
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The numbers of page to return
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       anotherName:
 *                         type: string
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The comic's name.
 *                         example: Leanne Graham
 *                       kind:
 *                         type: array
 *                         items:
 *                          type: string
 */
Router.get("/recently", paginate, Controller.getRecentUpdated);

/**
 * @swagger
 * /top-comic/month:
 *   get:
 *     summary: Retrieve a list of top comic in month
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/top-comic/month", Controller.getTopComicMonth);

/**
 * @swagger
 * /home-comment:
 *   get:
 *     summary: Retrieve a list of top comic in month
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/home-comment", Controller.getHomeComment);

/**
 * @swagger
 * /hot:
 *   get:
 *     summary: Retrieve a list of hot comic card info
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/hot/", paginate, Controller.getHotPage);

/**
 * @swagger
 * /truyen-tranh/{id}:
 *   get:
 *     summary: Retrieve comic details
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/truyen-tranh/:id", Controller.getComicPage);

/**
 * @swagger
 * /comic-comment/{id}:
 *   get:
 *     summary: Retrieve comic details
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/comic-comment/:id", Controller.getComicComment);

/**
 * @swagger
 * /truyen-tranh/{id}/{chapterId}/{hash}:
 *   get:
 *     summary: Retrieve comic details
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: vo-luyen-dinh-phong
 *       - in: path
 *         name: chapterId
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: chap-1735
 *       - in: path
 *         name: hash
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: 796832
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */

Router.get("/truyen-tranh/:id/:chapterId/:hash", Controller.getChapterPage);

/**
 * @swagger
 * /find:
 *   get:
 *     summary: Retrieve comic details
 *     description: Find comic by genres, max_chapter, ...
 *     parameters:
 *       - in: query
 *         name: genders
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/find/", paginate, Controller.findComicPage);

/**
 * @swagger
 * /find-by-name:
 *   get:
 *     summary: Retrieve comic details
 *     description: Find comic by genres, max_chapter, ...
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: one
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/find-by-name", paginate, Controller.findComicByName);

/**
 * @swagger
 * /cors:
 *   get:
 *     summary: Retrieve comic details
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: json
 *           required:
 *             - url
 *           properties:
 *             url:
 *               type: string
 *               example: http://anhtop.com/data/images/25132/779443/009.jpg?data=net
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */

Router.get("/cors/:proxyUrl*", Controller.corsAnywhere);

Router.get("/cors", Controller.corsAnywhere); // TODO: fix swagger can't use above route

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/test", Controller.test);

export default Router;
