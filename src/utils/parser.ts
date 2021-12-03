import axios from "axios";
import { ErrorRequestHandler } from "express";
import { JSDOM } from "jsdom";
import { GENRES_LIST } from "../../constants.js";
import { API_URL } from "../../config.env.js";

import { readFileSync, write, writeFileSync } from "fs";
import { URL } from "url";
import { argv } from "process";

/* -------------------------------------------------------------------------- */
/*                              NOTE: DEPRECATED                              */
/* -------------------------------------------------------------------------- */

// Prevent app crash
// process.on('uncaughtException', (error, origin) => {
//   console.log('----- Uncaught exception -----')
//   // console.log(error)
//   console.log('----- Exception origin -----')
//   // console.log(origin)
// })

// process.on('unhandledRejection', (reason, promise) => {
//   console.log('----- Unhandled Rejection at -----')
//   // console.log(promise)
//   console.log('----- Reason -----')
//   // console.log(reason)
// })

const myUrl = "http://nettruyenpro.com/";

async function getDocumentByUrl(
  urlString: string
): Promise<Document | undefined> {
  try {
    const url = new URL(urlString);
    const { data } = await axios.get(url.href);
    const html = new JSDOM(data);
    const document = html.window.document;

    return document;
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
}

/* -------------------------------------------------------------------------- */
/*                                parseListGen2                               */
/* -------------------------------------------------------------------------- */

type QueryArrT = {
  type: 'QueryArrT'
  selectorAll: string;
  attribute: string;
  callback: (e: Element) => any;
}

type QueryObjT = {
  type: 'QueryObjT'
  selector: string;
  attribute: string;
  callback: (e: Element) => any;
}

type QueryListT = {
  [K: string]: QueryArrT | QueryObjT;
}

function isQueryArrT (arg: any) : arg is QueryArrT{
  return arg.type === 'QueryArrT'
}

// async function parseListGen2 (document: Document, query: QueryListT) {

// }
