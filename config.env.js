import dotenv from "dotenv";

dotenv.config();

export const API_URL = process.env.API_URL || "http://www.nettruyenpro.com/";
export const PORT = process.env.PORT || 8000;
export const SERVER_URL =
  process.env.SERVER_URL || "http://localhost:8000/api/v1";
