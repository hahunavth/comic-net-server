declare const Router: import("express-serve-static-core").Router;
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
