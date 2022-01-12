import { LIMIT } from "../../constants.js";

export const pageToPagination = (page: string, limit: string) => {
  const _page = Number(page);
  const _limit = Number(limit) || LIMIT;

  const offset = _limit * _page - _limit;

  return offset;
};

export const checkDotEnv = () => {
  const requireList = ["API_URL"];
  for (const key of requireList) {
    if (!process.env[key]) {
      console.log("require", key);
    }
  }
};

export function getComicSlug(path: string) {
  const start = path.indexOf("/truyen-tranh/");
  console.log(start);
  const end = path.indexOf("/", start + 14);
  console.log(end);
  if (start > -1) {
    return path.substring(start, end === -1 ? undefined : end);
  }
  console.warn(`Path is not valid: ${path}`);
  return null;
}

export function getChapterSlug(path: string) {
  const start = path.indexOf("/truyen-tranh/");
  if (start > -1) {
    return path.substring(start);
  }
  console.warn(`Path is not valid: ${path}`);
  return null;
}
