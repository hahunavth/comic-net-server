import axios from "axios";
import { ErrorRequestHandler } from "express";
import { JSDOM } from "jsdom";
import path from "path";
import { GENRES_LIST } from "../../constants.js";
import { API_URL } from "../../config.env.js";

import {readFileSync, write, writeFileSync} from 'fs'
import url from "url";

const myUrl = new url.URL('https://nettr.com/path?name=hello&a=123');

function getHtml (url: URL) {
  return url
}

console.log(getHtml(myUrl))