import axios from "axios";
import e, { ErrorRequestHandler } from "express";
// import dotenv from "dotenv";
import { JSDOM } from "jsdom";
import path from "path";
import { GENRES_LIST } from "../../constants.js";
import { API_URL } from "../../config.env.js";

// import { readFileSync, write, writeFileSync } from "fs";

//  CONFIG
// dotenv.config({
//   // for commonjs use __dirname, "../.env"
//   path: path.resolve(new URL("../../.env", import.meta.url).pathname),
// });

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    Referer: API_URL,
  },
});

//  EXPORT CLASS
class Model {
  // static async getLogoUrl() {
  //   try {
  //     const { data } = await instance.get(API_URL);
  //     const imageUrls = parseListGen(
  //       data,
  //       [{ selectorAll: ".logo > img", query: "src" }],
  //       handleUrl
  //     );
  //     return imageUrls;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  static async RecentUpdate(page: number) {
    const { data } = await instance.get(`/?page=${page || 1}`);
    // writeFileSync("../../test.html", data);   // NOTE: Need to disable in production
    const result = await getComicCard(data);
    // const res3 = await getNewComment(data);
    return result && result[0];
    // return res2 && res2[0]
    // return res3 && res3[0];
  }

  static async getTopComicMonth() {
    const { data } = await instance.get(`/`);
    const result = await getTopList(data);
    return result && result[0];
  }

  static async getHomeComment() {
    const { data } = await instance.get(`/`);
    const result = await getNewComment(data);
    return result && result[0];
  }

  static async getHotPage(page?: number) {
    const { data } = await instance.get(`/hot?${page || 1}`);
    const result = await getComicCard(data);
    return result && result[0];
  }

  static async getComicPage(path: string) {
    try {
      const { data } = await instance.get(`${path}`);
      // console.log(`${path}`);
      const result: any = parseListGen(
        data,
        {
          title: { selector: ".title-detail", attribute: "" },
          posterUrl: {
            selector: ".col-image  > img",
            attribute: "src",
            callback: (e: string) => {
              return e.indexOf("http") === -1 ? "http" + e : e;
            },
          },
          author: { selector: ".author > .col-xs-8", attribute: "" },
          status: { selector: ".status > .col-xs-8", attribute: "" },
          kind: { selector: ".kind > .col-xs-8", attribute: "" },
          info: {
            selector: ".list-info > li:last-child > .col-xs-8",
            attribute: "",
          },
          rete: { selector: ".mrt5  > span > span:first-child", attribute: "" },
          views: { selector: ".mrt5  > span > span:last-child", attribute: "" },
          follows: { selector: ".follow > span > b", attribute: "" },
          detail: { selector: ".detail-content > p", attribute: "" },
          chapters: {
            selectorAll: "nav > ul > .row > .chapter > a",
            attribute: "",
          },
          chapterLinks: {
            selectorAll: "nav > ul > .row > .chapter > a",
            attribute: "href",
          },
          chapterUpdateAt: {
            selectorAll: "li > .col-xs-4.text-center.small",
            attribute: "",
          },
          chapterViews: {
            selectorAll: "li > .col-xs-3.text-center.small",
            attribute: "",
          },
        },
        (e: Element, attr: string) => {
          if (!attr) return e.textContent || "";
          else {
            return e.getAttribute(attr);
          }
        }
      );

      result.kind = result.kind.split(" - ");
      result.id = path;

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log(error);
    }
  }

  static async FindComic() {
    try {
      function toIdList(ids: number[]) {
        return ids.reduce((prev, id) => prev + id, "");
      }
      const ids = toIdList([2, 4]);
      const { data } = await instance.get(`/tim-truyen-nang-cao?genres=${ids}`);
      return getComicCard(data);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log(error);
    }
  }

  static async getChapterPage(path: string) {
    const { data } = await instance.get(`${path}`);
    const result = parseListGen(
      data,
      {
        title: { selector: ".txt-primary > a", attribute: "" },
        chapterName: {
          selector: ".txt-primary > span",
          attribute: "",
          callback: function T(str: string) {
            return str.replace("- ", "");
          },
        },
        updateAt: {
          selector: ".top > i",
          attribute: "",
          callback: (data: string) =>
            data?.replace("[Cập nhật lúc: ", "").replace("]", ""),
        },
        images: {
          selectorAll: ".page-chapter > img",
          attribute: "data-original",
          callback: (data: string[]) =>
            data.map((url) => {
              if (url.indexOf("http") === -1) {
                return "http:" + url;
              }
              return url;
            }),
        },
        chapterList: {
          selectorAll: "option",
          attribute: "",
          callback: (data: string) => {
            // console.log(data);
            return data;
          },
        },
      },
      (e: Element, attr: string) => {
        if (!attr) return e.textContent || "";
        else {
          return e.getAttribute(attr);
        }
      }
    );
    return result;
  }


  static async getComicComment(path: string) {
    try {
      const comicId = getComicIdBySlug(path);
      console.log(comicId)

      return await getCommentInChapterPage(comicId);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      else console.log(error);
    }
  }
}

// Model.RecentUpdate(1).then((data) => console.log(data));
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// getCommentInChapterPage("12345", 1).then((r) => console.log(r));
// console.log(getComicIdBySlug('http://www.nettruyenpro.com/truyen-tranh/het-nhu-han-quang-gap-nang-gat-28247'))

// TODO: CHECK VALID SLUG
function getComicIdBySlug(slug: string) {
  return slug.slice(slug.lastIndexOf("-") + 1);
}

function getChapterIdBySlug(slug: string) {
  return slug.slice(slug.lastIndexOf("/") + 1, -1);
}

async function getCommentInChapterPage(
  comicId: string | number,
  page?: number
) {
  console.log("🚀 ~ file: index.ts ~ line 227 ~ comicId", comicId)
  const { data } = await instance.get(
    `http://www.nettruyenpro.com/Comic/Services/CommentService.asmx/GetList?comicId=${comicId}&orderBy=0&chapterId=0&parentId=0&pageNumber=${page || 1}`
  );
  // console.log(data.response)
  // console.log(data.pager)

  const pager = parseListGen(
    data.pager,
    {
      pageInfo: {
        selector: ".pagination",
        attribute: "",
        callback: (r: string) => {
          const info = r
            .trim()
            .slice(r.trim().indexOf(" "), r.trim().indexOf("«"))
            .trim()
            .split(" ")
            .filter((s) => s !== "of");
          return {
            current: info[0],
            max: info[1],
          };
        },
      },
    },
    (e: Element, attr: string) => {
      if (!attr) return e.textContent || "";
      else {
        return e.getAttribute(attr);
      }
    }
  );

  const comment = parseListGen(
    data.response,
    {
      res: {
        selectorAll: ".journalrow",
        attribute: "",
        customSelector: true,
        callback: (e) => e,
      },
    },
    (e: Element, attr: string, query, i) => {
      if (i === "res")
        return {
          username: e?.querySelector(".authorname")?.textContent,
          role: e?.querySelector(".member")?.textContent,
          avatarUrl: e?.querySelector(".author > img")?.getAttribute("src"), // TODO: Validate link, Ex:  avatarUrl: '//s.nettruyenpro.com/Data/SiteImages/anonymous.png',
          abbr: e?.querySelector("abbr")?.getAttribute("title"),
          datednf: e?.querySelector("abbr")?.textContent?.trim(),
          chapterName: e?.querySelector(".cmchapter")?.textContent, // NOTE: Can be undefined by src
          content: e.querySelector(".summary")?.textContent,

          reply: [...e.querySelectorAll(".jcmt > li:not([class])")].map((e) => {
            return {
              username: e?.querySelector(".authorname")?.textContent,
              role: e?.querySelector(".member")?.textContent,
              avatarUrl: e?.querySelector(".author > img")?.getAttribute("src"), // TODO: Validate link, Ex:  avatarUrl: '//s.nettruyenpro.com/Data/SiteImages/anonymous.png',
              abbr: e?.querySelector("abbr")?.getAttribute("title"),
              datednf: e?.querySelector("abbr")?.textContent?.trim(),
              chapterName: e?.querySelector(".cmchapter")?.textContent, // NOTE: Can be undefined by src
              content: e.querySelector(".summary")?.textContent,
            };
          }),
        };
      if (!attr) return e.textContent || "";
      else {
        return e.getAttribute(attr);
      }
    }
  );

  return {
    comment,
    pager,
  };
}

async function getNewComment(data: string) {
  const list = parseListGen(
    data,
    [{ selectorAll: ".box > .scroll-y > ul > li", attribute: "" }],
    (e: HTMLElement) => {
      return {
        name: e.querySelector("h3 > a")?.textContent,
        path: e
          .querySelector("h3 > a")
          ?.getAttribute("href")
          ?.replace("http://www.nettruyenpro.com", ""),
        url: e.querySelector("h3 > a")?.getAttribute("href"),
        authorName: e.querySelector("a > span")?.textContent,
        date: e.querySelector("abbr")?.getAttribute("title"),
        time: e.querySelector("abbr")?.textContent,
        content: e.querySelector("p")?.textContent,
      };
    }
  );

  return list;
}

async function getTopList(data: string) {
  const list = await parseListGen(
    data,
    [
      {
        selectorAll: "#topMonth > ul > li",
        attribute: "",
        callback: (e: string) => e,
      },
    ],
    (e: HTMLElement) => {
      return {
        top: e.querySelector("span")?.textContent,
        posterUrl: e
          .querySelector("div > a > img")
          ?.getAttribute("data-original"),
        name: e.querySelector("h3 > a")?.textContent,
        path: e.querySelector("h3 > a")?.getAttribute("href"),
        lastedChapter: {
          name: e.querySelector("p > a")?.textContent,
          path: e.querySelector("p > a")?.getAttribute("href"),
        },
        views: e.querySelector("p > span")?.textContent?.trim(),
      };
    }
  );
  return list;
}

// get comic card info (homePage, findPage)
async function getComicCard(data: string) {
  try {
    const list = parseListGen(
      data,
      [
        {
          selectorAll: ".row > .item",
          attribute: "",
          customSelector: true,
        },
      ],
      (e: Element, attr: string, query: queryA_T, i: number) => {
        if (query[i].customSelector) {
          const tmp: string[] =
            e.textContent?.split("\n").filter((str) => {
              return str;
            }) || [];

          // type res_T = {
          //   [key: string]: any
          // }
          const result: any = {};

          const labels = [
            "Thể loại:",
            "Tác giả:",
            "Tình trạng:",
            "Lượt xem:",
            "Theo dõi:",
            "Ngày cập nhật:",
            "Tên khác:",
          ];

          const props = [
            "kind",
            "author",
            "status",
            "views",
            "follows",
            "updateAt",
            "anotherName",
          ];

          tmp.forEach((str) => {
            for (let i = 0; i < labels.length; i++) {
              if (str.includes(labels[i])) {
                if (props[i] === "kind")
                  result[props[i]] = str.replace(labels[i], "").split(", ");
                else result[props[i]] = str.replace(labels[i], "");
              }
            }
          });

          result.name = e.querySelector(".title")?.textContent || null;
          result.posterPath =
            e.querySelector(".img_a")?.getAttribute("data-original") || null;
          if (result.posterPath?.indexOf("http:") === -1) {
            result.posterPath = "http:" + result.posterPath;
          }
          result.path =
            e.querySelector("a")?.getAttribute("href")?.replace(API_URL, "") ||
            null;
          result.id = result.path;

          const e2 = e.querySelectorAll(
            ".item > figure > figcaption > ul > li"
          );
          result.lastedChapters = [...e2].map((e) => {
            return {
              chapterName: e.querySelector("a")?.textContent,
              chapterUrl: e.querySelector("a")?.getAttribute("href"),
              updateAt: e.querySelector("i")?.textContent,
            };
          });

          return result;
        }
        if (!attr) return e.textContent || "";
        else {
          return e.getAttribute(attr) || null;
        }
      }
    );
    return list;
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
}

function parseList(html: string) {
  const { window } = new JSDOM(html);
  const { document } = window;

  const eles = document.querySelectorAll(".logo");

  const list = [...eles].map((ele: Element) => {
    const ele2 = ele.querySelector("img");
    return ele2 && ele2.getAttribute("src");
  });

  return list;
}

// callback for parseListGen
function handleUrl(element: HTMLElement, attribute: string) {
  const str = element.getAttribute(attribute);
  return str && str.replace("http://www.nettruyenpro.com", "");
}

/*
  Parameter:
    html: html string
    query: {
      ...key: { selector | selectorAll: string, attribute: string, callback?: (data) => data }
    } || [
      { selector | selectorAll: string, attribute: string, callback?: (data) => data }
    ]
    callback?: (element, attribute, query, cursor) => result

  Return type follow query type!
*/

type queryOne_T = {
  selector?: string;
  selectorAll?: string;
  attribute: string;
  customSelector?: boolean;
  callback?: (a: any) => any;
};

type queryO_T = {
  [key: string | number]: queryOne_T;
};
type queryA_T = queryOne_T[];
type gCallback_T = (a: any, b: any, c?: any, d?: any) => any;

export function parseListGen(
  html: string,
  query: queryO_T | queryA_T,
  callback: gCallback_T
) {
  const { window } = new JSDOM(html);
  const { document } = window;
  const data: any = Array.isArray(query) ? [] : {};
  Object.keys(query).forEach((i: any) => {
    let res;
    if (query[i].selectorAll) {
      const elements = document.querySelectorAll(query[i].selectorAll || "");
      res = [...elements].map((e) => {
        const result = callback(e, query[i].attribute, query, i);
        return result || null;
      });
    } else {
      const element = document.querySelector(query[i].selector || "");
      if (element) res = callback(element, query[i].attribute);
      else res = null;
    }
    if (typeof query[i].callback === "function") {
      res = query[i].callback?.(res);
    }
    data[i] = res;
  });
  return data;
}

export default Model;
