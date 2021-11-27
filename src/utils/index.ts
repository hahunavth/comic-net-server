import { LIMIT } from '../../constants.js';

export const pageToPagination = (page: string, limit: string) => {
  const _page = Number(page);
  const _limit = Number(limit) || LIMIT

  const offset = _limit * _page - _limit;

  return  offset ;
};

export const checkDotEnv = () => {
  const requireList = [
    'API_URL'
  ];
  for(const key of requireList) {
    if(!process.env[key]) {
      console.log("require", key)
    }
  }
}
