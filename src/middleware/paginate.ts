import { LIMIT } from "../../constants.js";
import { pageToPagination } from "../utils/index.js";
import { Request, Response, NextFunction } from "express";

import t from "io-ts";

const PaginateRT = t.type({
  page: t.string,
  limit: t.string,
});

type PaginateT = t.TypeOf<typeof PaginateRT>;

export default function paginate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = req.query;

    if (page) {
      res.locals = {
        paginate: true,
        page,
        limit: limit || LIMIT,
        offset: pageToPagination(
          typeof page === "string" ? page : "",
          typeof limit === "string" ? limit : ""
        ),
      };
      // console.log(res.locals);
    }

    next();
  } catch (error) {
    next(error);
  }
}
