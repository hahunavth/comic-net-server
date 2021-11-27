import { LIMIT } from "../../constants.js";
import { pageToPagination } from "../utils/index.js";

export default function paginate(req, res, next) {
    try {

        const {page, limit} = req.query;

        if(page) {
            res.locals = {
                ...req.locals, 
                paginate: true, 
                page, 
                limit: limit || LIMIT,
                offset: pageToPagination(page, limit || LIMIT)
            }
            console.log(res.locals)
        }
        
        next();
    } catch (error) {
        next(error)
    }
}