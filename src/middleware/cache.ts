import mcache from "memory-cache";
import { Request, Response, NextFunction } from "express";

const DEFAULT_DURATION = 10800 / 3; // 1 hours

const cache = (duration = DEFAULT_DURATION) => {
  return (req: any, res: any, next: NextFunction) => {
    const key = "__express__" + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) return res.send(cachedBody);

    res.sendResponse = res.send;
    res.send = (body: any) => {
      mcache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };

    next();
  };
};

export default cache;
