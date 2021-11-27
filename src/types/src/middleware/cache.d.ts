import { NextFunction } from "express";
declare const cache: (duration?: number) => (req: any, res: any, next: NextFunction) => any;
export default cache;
