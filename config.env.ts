import "dotenv/config";
// import dotenv from "dotenv";
// dotenv.config();

export const API_URL = process.env.API_URL || "http://www.nettruyengo.com";
export const PORT = process.env.PORT || 3000;
export const SERVER_URL =
  process.env.SERVER_URL || "http://localhost:3000/api/v1";
