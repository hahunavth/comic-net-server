import axios from "axios";
import { API_URL } from "../../config.env.js";
import fs from "fs";
import { parseListGen } from "./index.js";
import fetch from "node-fetch";

const Login_Url =
  "https://www.nettruyenpro.com/Secure/Login.aspx?returnurl=%2f";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    Referer: API_URL,
  },
});

(async () => {
  const res = await instance.get("/Secure/Login.aspx?returnurl=%2f", {
    withCredentials: true,
  });

  const data = res.data;

  const value = parseListGen(
    data,
    {
      __LASTFOCUS: {
        selector: "#__LASTFOCUS",
        attribute: "value",
        callback: (e) => e || "",
      },
      __VIEWSTATEFIELDCOUNT: {
        selector: "#__VIEWSTATEFIELDCOUNT",
        attribute: "value",
      },
      __VIEWSTATE: { selector: "#__VIEWSTATE", attribute: "value" },
      __VIEWSTATE1: { selector: "#__VIEWSTATE1", attribute: "value" },
      __VIEWSTATE2: { selector: "#__VIEWSTATE2", attribute: "value" },
      __VIEWSTATEGENERATOR: {
        selector: "#__VIEWSTATEGENERATOR",
        attribute: "value",
      },
      __EVENTTARGET: {
        selector: "#__EVENTTARGET",
        attribute: "value",
        callback: (e) => e || "",
      },
      __EVENTARGUMENT: {
        selector: "#__EVENTARGUMENT",
        attribute: "value",
        callback: (e) => e || "",
      },
      __EVENTVALIDATION: { selector: "#__EVENTVALIDATION", attribute: "value" },
    },
    (e: Element, attr: string) => {
      if (!attr) return e.textContent || "";
      else {
        return e.getAttribute(attr) || "";
      }
    }
  );

  const requestPayload = {
    ...value,
    ctl00$mainContent$login1$LoginCtrl$UserName: "vuthanhha2k1@gmail.com",
    ctl00$mainContent$login1$LoginCtrl$Password: "3h8Fpzhb@RpG9b5",
    ctl00$mainContent$login1$LoginCtrl$RememberMe: "on",
    ctl00$mainContent$login1$LoginCtrl$Login: "Đăng nhập",
  };

  const payload = Object.keys(requestPayload)
    .map((key) => `${key}=${encodeURIComponent(requestPayload[key])}`)
    .join("&");

  console.log(payload);

  const res2 = await instance.post(
    "/Secure/Login.aspx?returnurl=%2f",
    {
      Headers: {
        "content-type": "application/x-www-form-urlencoded",
        referer: "https://www.nettruyenpro.com/Secure/Login.aspx?returnurl=%2F",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      },
      data: payload,
    },
    {
      withCredentials: true,
    }
  );

  //   const res2 = await fetch(Login_Url, {
  //     method: 'POST',
  //     body: new URLSearchParams(requestPayload),
  //     headers: {

  //     }
  // });

  const value2 = parseListGen(
    res2.data,
    {
      "nav-account": { selector: ".user-menu", attribute: "" },
    },
    (e: Element, attr: string) => {
      if (!attr) return e.textContent || "";
      else {
        return e.getAttribute(attr) || "";
      }
    }
  );

  console.log(res2.headers);
  console.log(value2);

  const res3 = await instance.get("/Secure/LoginHandler.aspx");
  console.log(res3);
  // fs.writeFileSync('../../test.html', res2.data  )
  // fs.writeFile('../../test.html', data, (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  //   })

  // console.log(data);
})();
