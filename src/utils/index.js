import dotenv from 'dotenv';
dotenv.config();

import { LIMIT } from '../../constants.js';

export const pageToPagination = (page, limit = LIMIT) => {
  const _page = Number(page);
  const _limit = Number(limit);

  const offset = _limit * _page - _limit;

  return  offset ;
};

export const checkDotEnv = () => {
  const requireList = [
    'API_URL'
  ];
  for(let key of requireList) {
    if(!process.env[key]) {
      console.log("require", key)
    }
  }
}
