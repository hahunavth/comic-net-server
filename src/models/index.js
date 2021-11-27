import axios from "axios";
import dotenv from "dotenv";
import { JSDOM } from "jsdom";
import path from "path";
import {GENRES_LIST} from '../../constants.js';

//  CONFIG
dotenv.config({
  // for commonjs use __dirname, "../.env"
  path: path.resolve(new URL("../../.env", import.meta.url).pathname),
});

const instance = axios.create({
  baseURL: process.env.API_URL ,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    Referer: process.env.API_URL,
  },
});

//  EXPORT CLASS
class Model {
  static async getLogoUrl() {
    try {
      const { data } = await instance.get(process.env.API_URL);
      const imageUrls = parseListGen(
        data,
        [{ selectorAll: ".logo > img", query: "src" }],
        handleUrl
      );
      return imageUrls;
    } catch (e) {
      console.log(e);
    }
  }

  static async RecentUpdate(page) {
    const { data } = await instance.get(`/?page=${page || 1}`);
    const result = await getComicCard(data);
    return result && result[0];
  }

  static async getHotPage() {
    const { data } = await instance.get(`/hot`);
    return getComicCard(data);
  }

  static async getComicPage(path) {
    try {
      const { data } = await instance.get(`${path}`);
      console.log(`${path}`);
      let result = parseListGen(
        data,
        {
          title: { selector: ".title-detail", attribute: "" },
          posterUrl: {
            selector: ".col-image  > img",
            attribute: "src",
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
        (e, attr) => {
          if (!attr) return e.textContent || "";
          else {
            return e.getAttribute(attr);
          }
        }
      );

      result.kind = result.kind.split(" - ");
      result.id = path;

      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  static async FindComic() {
    try {

      function toIdList(ids) {
        return ids.reduce((prev, id) => prev + id, "");
      }
      const ids = toIdList([2, 4]);
      const { data } = await instance.get(`/tim-truyen-nang-cao?genres=${ids}`);
      return getComicCard(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  static async getChapterPage(path) {
    const { data } = await instance.get(`${path}`);
    let result = parseListGen(
      data,
      {
        title: { selector: ".txt-primary > a", attribute: "" },
        chapterName: {
          selector: ".txt-primary > span",
          attribute: "",
          callback: (str) => str.replace("- ", ""),
        },
        updateAt: {
          selector: ".top > i",
          attribute: "",
          callback: (data) =>
            data?.replace("[Cập nhật lúc: ", "").replace("]", ""),
        },
        images: {
          selectorAll: ".page-chapter > img",
          attribute: "data-original",
          callback: (data) =>
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
          callback: (data) => {
            console.log(data);
            return data;
          },
        },
      },
      (e, attr, query, i) => {
        if (!attr) return e.textContent || "";
        else {
          return e.getAttribute(attr);
        }
      }
    );
    console.log(result);
    return result;
  }
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

// get comic card info (homePage, findPage)
async function getComicCard(data) {
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
      (e, attr, query, i) => {
        if (query[i].customSelector) {
          let tmp = e.textContent.split("\n").filter((str) => {
            return str;
          });
          let result = {};

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
                result[props[i]] = str.replace(labels[i], "");
              }
            }
          });

          result.name = e.querySelector(".title").textContent;
          result.posterPath = e
            .querySelector(".img_a")
            .getAttribute("data-original");
          if (result.posterPath.indexOf("http:") === -1) {
            result.posterPath = "http:" + result.posterPath;
          }
          result.path = e
            .querySelector("a")
            .getAttribute("href")
            .replace(process.env.API_URL, "");
          result.id = result.path;

          let e2 = e.querySelectorAll(".item > figure > figcaption > ul > li");
          result.lastedChapters = [...e2].map((e) => {
            return {
              chapterName: e.querySelector("a").textContent,
              chapterUrl: e.querySelector("a").getAttribute("href"),
              updateAt: e.querySelector("i").textContent,
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
  } catch (error) {
    console.log(error.message);
  }
}

function parseList(html) {
  const { window } = new JSDOM(html);
  const { document } = window;

  const eles = document.querySelectorAll(".logo");

  const list = [...eles].map((ele) => {
    return ele.querySelector("img").getAttribute("src");
  });

  return list;
}

// callback for parseListGen
function handleUrl(element, attribute) {
  return element
    .getAttribute(attribute)
    .replace("http://www.nettruyenpro.com", "");
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
function parseListGen(html, query, callback) {
  const { window } = new JSDOM(html);
  const { document } = window;

  let data = {};
  for (let i in query) {
    let res;
    if (query[i].selectorAll) {
      const elements = document.querySelectorAll(query[i].selectorAll);
      res = [...elements].map((e) => {
        const result = callback(e, query[i].attribute, query, i);
        return result || null;
      });
    } else {
      const element = document.querySelector(query[i].selector);
      if (element) res = callback(element, query[i].attribute);
      else res = null;
    }
    if (typeof query[i].callback === "function") {
      res = query[i].callback(res);
    }
    data[i] = res;
  }

  return data;
}

export default Model;
