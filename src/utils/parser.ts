import axios from "axios";
import { ErrorRequestHandler } from "express";
import { JSDOM } from "jsdom";
import { GENRES_LIST } from "../../constants.js";
import { API_URL } from "../../config.env.js";

import { readFileSync, write, writeFileSync } from "fs";
import { URL } from "url";
import { argv } from "process";
import { callbackify } from "util";
import { stringify } from "querystring";
import { string } from "fp-ts";

// // /* -------------------------------------------------------------------------- */
// // /*                              NOTE: DEPRECATED                              */
// // /* -------------------------------------------------------------------------- */

const myUrl = "http://nettruyengo.com/";

export async function getDocumentByUrl(
  urlString: string
): Promise<HTMLElement | undefined> {
  try {
    const url = new URL(urlString);
    const { data } = await axios.get(url.href);
    const html = new JSDOM(data);
    const document = html.window.document.body;

    return document;
  } catch (error: unknown) {
    if (error instanceof Error) console.warn(error.message);
    else console.warn(error);
  }
}

type QueryOneT<Tk> = {
  selector: string;
  attribute?: string;
  nested?: QueryListT<Tk>;
  callback?: (el: Element) => any;
};

type QueryAllT<Tk> = {
  selectorAll: string;
  attribute?: string;
  nested?: QueryListT<Tk>;
  callback?: (el: Element) => any;
  aCallback?: (els: Element[]) => any;
};

type QueryItemT<Tk> = QueryOneT<Tk> | QueryAllT<Tk>;
// type QueryArrT = QueryItemT[];
type QueryListT<T> = {
  [k in keyof T]: QueryItemT<T[k]>;
};

type QueryReturnT = {
  [k: string]: string | string[] | QueryReturnT
}

const returnType = {
  i: string,
  b: {
    c: string,
  },
};

(async () => {
  const doc = await getDocumentByUrl(API_URL);
  if (doc) {
    const res = parseListGen3<typeof returnType>(doc, {
      i: { selector: "a", attribute: "href" },
      b: {
        selectorAll: "div",
        nested: { c: { selector: "a", attribute: 'href' } },
      },
    });
    console.log(res);
  }
})();

function isQueryOneT<Tk>(obj: any): obj is QueryOneT<Tk> {
  return obj.selector !== undefined;
}

function isQueryAllT<Tk>(arg: any): arg is QueryAllT<Tk> {
  return arg.selectorAll !== undefined;
}

export function parseListGen3<T>(document: HTMLElement, query: QueryListT<T>) {
  try {

    let result: {
      [k in keyof T]?: any;
    } = {};
    Object.keys(query).forEach((key, id) => {
      // console.log(key);
      const qItem = query[key as keyof T];

      // if nested -> recursive
      if (qItem.nested) {
        let element = document;

        if (isQueryOneT<any>(qItem)) {
          const selectElement = document.querySelector(
            qItem.selector
          ) as HTMLElement;
          if (selectElement !== null) element = selectElement;
          else
            console.warn(
              `SELECTOR FAIL: key: ${key} -> selector: ${qItem.selector}`
            );
            result[key as keyof T] = {
              ...parseListGen3<any>(element, qItem.nested),
            };
        }

        if(isQueryAllT<any>(qItem)) {
          const els = document.querySelectorAll(qItem.selectorAll);
          if(!els) 
          return [];
          result[key as keyof T] = []
          const elList = [...els];
          const nested = qItem.nested
          elList.forEach(el => {
            result[key as keyof T].push(parseListGen3<any>(el as HTMLElement, nested))
          })

        }


      } else {
        // if not -> parse
        // parse selector and selectorAll
        if (isQueryOneT<any>(qItem))
          result[key as keyof T] = parseItemOne<any>(document, qItem);
        if (isQueryAllT<any>(qItem))
          result[key as keyof T] = parseItemAll(document, qItem);
      }
    });
    return result;

  } catch (error: unknown) {
    if (error instanceof Error) console.warn(error.message);
    else console.warn(error);
  }
}

function parseItemOne<T>(
  document: Document | HTMLElement,
  query: QueryOneT<T>
): string | null {
  // console.log("parse One", document, query);

  const el = document.querySelector(query.selector);

  // Check error
  if (!el) {
    console.warn(`not found ${query.selector}`);
    return null;
    // throw new Error(`not found: ${query.selector}`);
  }

  // Handle
  if (query.attribute) return el.getAttribute(query.attribute);
  if (query.callback) return query.callback(el);

  // Not handle
  throw new Error(`Need attr or callback: ${query}`);
}

function parseItemAll<T>(
  document: Document | HTMLElement,
  query: QueryAllT<T>
) {
  // console.log("parse All", document, query);

  const result: any[] = [];
  const els = document.querySelectorAll(query.selectorAll);

  if (query.aCallback) {
    query.aCallback([...els]);
  }

  els.forEach((el, id) => {
    if (query.attribute) result.push(el.getAttribute(query.attribute));
    if (query.callback) result.push(query.callback(el));
  });

  return result;
}

// // (async () => {
// //   const doc = await getDocumentByUrl(myUrl);
// //   if (!doc) {
// //     console.log("doc", doc);
// //     return null;
// //   }
// //   type dataType = {
// //     data: string;
// //     item: {
// //       a: string;
// //     };
// //     c: {
// //       a: {
// //         b: {
// //           d: string;
// //         };
// //       };
// //     };
// //   };
// //   // const result = parseListGen2<dataType>(
// //   //   doc,
// //   //   {
// //   //     data: {
// //   //       selectorAll: "img",
// //   //       attribute: "src",
// //   //     },
// //   //     item: {
// //   //       selectorAll: ".item",
// //   //       attribute: (e) => ({
// //   //         a: e.querySelector("a")?.getAttribute("href"),
// //   //       }),
// //   //     },
// //   //     c: {
// //   //       // a: {selector: '', attribute: ''}
// //   //       selector: '',
// //   //     }
// //   //   },
// //   //   (data) => data
// //   // );
// //   // console.log(result);
// // })();

// // /* -------------------------------------------------------------------------- */
// // /*                                parseListGen2                               */
// // /* -------------------------------------------------------------------------- */

// // // attribute === '' -> select textContent
// // // attribute === function -> callback
// // // attribute === string[] -> many attribute

// // // type QueryAllT = {
// // //   selectorAll: string;
// // //   attribute?:
// // //     | string
// // //     // | string[]
// // //     | ((e: Element, s: string, arrName: string) => any);
// // // };

// // // type QCallback = () => null

// // // type QueryOneT = {
// // //   selector: string;
// // //   attribute?:
// // //     | string
// // //     // | string[]
// // //     | ((e: Element, s: string, keyName: string) => any)
// // // };

// // // type QueryListGenT<T> = {
// // //   [K in keyof T]: QueryAllT | QueryOneT;
// // // };

// // // type GCallbackT<T> = (data: T) => T;

// // // type ResultGenT<T> = {
// // //   [k in keyof T]?: string | null | undefined | (string | null)[] | ResultGenT<T[k]>;
// // // };

// // // function isQueryAllT(arg: any): arg is QueryAllT {
// // //   return arg.selectorAll !== undefined;
// // // }

// // // function isQueryOneT(arg: any): arg is QueryOneT {
// // //   return arg.selector !== undefined;
// // // }

// // // function parseListGen2<T>(
// // //   document: Document | Element,
// // //   query: QueryListGenT<T>,
// // //   gCallback?: GCallbackT<T>
// // // ): ResultGenT<T[keyof T]> | undefined {
// // //   function getOne<T>(
// // //     e: Element | Document,
// // //     q: QueryOneT,
// // //     keyName: string
// // //   ): string | undefined | null | (string | null)[] | ResultGenT<T[keyof T]> {
// // //     const element = e.querySelector(q.selector);

// // //     if (!element) {
// // //       throw new Error("Can't get element: " + q + " !");
// // //     }

// // //     if (typeof q.attribute === "function") {
// // //       return q.attribute(element, q.selector, keyName);
// // //     }
// // //     if (typeof q.attribute === "string") {
// // //       if (q.attribute === "") return element?.textContent;
// // //       return element?.getAttribute(q.attribute);
// // //     }
// // //     if (typeof q.attribute === "object") {
// // //       // return q.attribute.map((attr, id, arr) => {
// // //       //   if (attr === "") return element.textContent;
// // //       //   return element.getAttribute(attr);
// // //       // });
// // //       // return parseListGen2<[k in keyof T]>(element, q.attribute)
// // //     }

// // //     throw new Error("Check attr type!");
// // //   }
// // //   function getAll(
// // //     e: Element | Document,
// // //     q: QueryAllT,
// // //     arrName: string
// // //   ): string | undefined | null | (string | null)[] {
// // //     const elements = e.querySelectorAll(q.selectorAll);

// // //     if (!elements.length) {
// // //       throw new Error("Can't get element: " + q + " !");
// // //     }

// // //     if (typeof q.attribute === "function") {
// // //       const callback = q.attribute;
// // //       return [...elements].map((item) => {
// // //         return callback(item, q.selectorAll, arrName);
// // //       });
// // //     }
// // //     if (typeof q.attribute === "string") {
// // //       const attribute = q.attribute;
// // //       return [...elements].map((element) => {
// // //         if (q.attribute === "") return element?.textContent;
// // //         return element?.getAttribute(attribute);
// // //       });
// // //     }

// // //     throw new Error("Check attr type!");
// // //   }

// // //   try {
// // //     const result: ResultGenT<T> = {};
// // //     const propNames = Object.keys(query) as [keyof T] as string[];
// // //     propNames.forEach((k, id, arr) => {
// // //       if (isQueryOneT(query[k as keyof T]))
// // //         result[k as keyof T] = getOne<T>(
// // //           document,
// // //           query[k as keyof T] as QueryOneT,
// // //           k
// // //         );
// // //       // else
// // //       result[k as keyof T] = getAll(
// // //         document,
// // //         query[k as keyof T] as QueryAllT,
// // //         k
// // //       );
// // //     });

// // //     return result;
// // //   } catch (error) {
// // //     console.log("XXX ~ file: parser.ts ~ line 202 ~ error", error)
// // //   }
// // // }

// // /* -------------------------------------------------------------------------- */
// // /*                                     End                                    */
// // /* -------------------------------------------------------------------------- */

// interface IQueryOne {
//   selector: string;
//   attribute: string | undefined;
//   nested?: IQueryOne | undefined;
//   callback?: (e: Element, s: string, arrName: string) => any;
//   keyName: string;
// }

// type ReturnT = {
//   [k: string]: string | undefined | null | ReturnT;
// };
// class QueryOne implements IQueryOne {
//   selector: string;
//   attribute: string | undefined;
//   nested?: IQueryOne | undefined;
//   callback?: (e: Element, s: string, arrName: string) => any;
//   keyName: string;

//   constructor({ attribute, selector, callback, nested, keyName }: IQueryOne) {
//     this.attribute = attribute;
//     this.selector = selector;
//     this.nested = nested;
//     this.callback = callback;
//     this.keyName = keyName;
//   }

//   query(e: Element | Document): ReturnT {
//     const element = e.querySelector(this.selector);
//     const result = {};
//     if (!element) {
//       throw new Error("Can't get element: " + this.selector + " !");
//     }

//     if (this.attribute !== undefined) {
//       if (this.attribute === "")
//         result[this.keyName] = element?.textContent
//       else
//       return { [this.keyName]: element?.getAttribute(this.attribute) };
//     }
//     if (typeof this.callback === "function") {
//       return {
//         [this.keyName]: this.callback(element, this.selector, this.keyName),
//       };
//     }
//     if (this.nested) {
//       const recusiveObj = new QueryOne(this.nested);
//       return { [this.keyName]: recusiveObj.query(e) };
//     }

//     // if (typeof q.attribute === "object") {
//     // return q.attribute.map((attr, id, arr) => {
//     //   if (attr === "") return element.textContent;
//     //   return element.getAttribute(attr);
//     // });
//     // return parseListGen2<[k in keyof T]>(element, q.attribute)
//     // }

//     throw new Error("Check attr type!");
//   }
// }

// ;(async() => {
//   const document = await getDocumentByUrl(myUrl);

//   const a = new QueryOne({attribute: 'href', keyName: '',selector: 'a', nested: {attribute: 'href', keyName: 'haha', selector: 'a'}})
//   console.log(a.query(document?.documentElement as Element))
// }) ()

// // export type queryOne_T = {
// //   selector?: string;
// //   selectorAll?: string;
// //   attribute: string;
// //   customSelector?: boolean;
// //   callback?: (a: any) => any;
// // };

// // export type queryO_T<T> = {
// //   [key in keyof T]: queryOne_T;
// // };
// // export type queryA_T = queryOne_T[];
// // type gCallback_T = (a: any, b: any, c?: any, d?: any) => any;

// // // TODO: Need refactor
// // export function parseListGen<T>(
// //   html: string,
// //   query: queryO_T<T> | queryA_T,
// //   callback: gCallback_T
// // ) {
// //   const { window } = new JSDOM(html);
// //   const { document } = window;
// //   const data: any = Array.isArray(query) ? [] : {};
// //   const arr = Object.keys(query) as unknown as keyof T
// //   arr.forEach((i) => {
// //     let res;
// //     if (query[i].selectorAll) {
// //       const elements = document.querySelectorAll(query[i].selectorAll || "");
// //       res = [...elements].map((e) => {
// //         const result = callback(e, query[i].attribute, query, i);
// //         return result || null;
// //       });
// //     } else {
// //       const element = document.querySelector(query[i].selector || "");
// //       if (element) res = callback(element, query[i].attribute);
// //       else res = null;
// //     }
// //     if (typeof query[i].callback === "function") {
// //       res = query[i].callback?.(res);
// //     }
// //     data[i] = res;
// //   });
// //   return data;
// // }

// // export type Validator<T> = T extends object ? ObjectValidator<T> : NativeTypeValidator<T>

// // export type NativeTypeValidator<T> = (n: any) => T | undefined
// // export type ObjectValidator<O extends object> = {
// //   [K in keyof O]: Validator<O[K]>
// // }

// // //native validators
// // export const SimpleStringValidator:NativeTypeValidator<string> = (val) => typeof(val) === "string" ? val : undefined
// // export const SimpleBooleanValidator:NativeTypeValidator<boolean> = (val) => typeof(val) === "boolean" ? val : undefined

// // type ValidatedObject<T> = Partial<{
// //   [key in keyof T]: T[key] extends NativeTypeValidator<infer Type>
// //     ? Type
// //     : T[key] extends ObjectValidator<infer Type>
// //     ? ValidatedObject<Type>
// //     : T[key] extends object
// //     ? ValidatedObject<T[key]>
// //     : T[key];
// // }>

// // const a : ValidatedObject<boolean> = {
// //   Test: {
// //     test2: true
// //   }
// // }
