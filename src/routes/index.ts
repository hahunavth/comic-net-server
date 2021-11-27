import express from "express";
import Controller from "../controllers/index.js";
import paginate from "../middleware/paginate.js";

const Router = express.Router();

// home page
/**
 * @swagger
 * /recently:
 *   get:
 *     summary: Retrieve a list of comic card info
 *     description: Retrieve a list of comics from nettruyen. Can be used to populate a list of fake comics when prototyping or testing an API.
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
Router.get("/hot/", Controller.getHotPage);

// comic page
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

// chapter page
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
 *           example: monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132
 *       - in: path
 *         name: chapterId
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: chap-16
 *       - in: path
 *         name: hash
 *         required: true
 *         description: endpoint path
 *         schema:
 *           type: string
 *           example: 779443
 *     responses:
 *       200:
 *         description: A list of comics.
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 */
Router.get("/truyen-tranh/:id/:chapterId/:hash", Controller.getChapterPage);

// find page
Router.get("/find/", Controller.findComicPage);

// image
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
 *           type: object
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
Router.get("/cors", Controller.corsAnywhere);

// test
Router.get("/test", Controller.test);

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

export default Router;
