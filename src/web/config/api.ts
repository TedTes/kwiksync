import axios from "axios";
import { vars } from "./";
export const api = axios.create({
  baseURL: `${vars.apiUrl}`,
  withCredentials: true,
});
