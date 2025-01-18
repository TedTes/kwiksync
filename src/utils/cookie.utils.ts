import { Response } from "express";

export const COOKIES: Cookies = {
  accessToken: {
    name: "accessToken",
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    },
  },
  refreshToken: {
    name: "refreshToken",
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
};

export const setCookie = (
  res: Response,
  type: keyof Cookies,
  value: string
) => {
  const cookie = COOKIES[type];
  res.cookie(cookie.name, value, cookie.options);
};
