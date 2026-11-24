import { Request, Response, NextFunction } from "express";
import * as authService from "@/services/auth.service";
import { revokeToken } from "@/services/token-blacklist";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    setTokenCookie(res, result.token);
    // Return only user data — token lives in httpOnly cookie, not response body
    res.status(201).json({ success: true, data: { user: result.user } });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    setTokenCookie(res, result.token);
    // Return only user data — token lives in httpOnly cookie, not response body
    res.json({ success: true, data: { user: result.user } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Revoke the token so it can't be used even if intercepted
    const cookieToken = req.cookies?.token;
    if (cookieToken) {
      revokeToken(cookieToken);
    }

    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const user = await authService.getMe(userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const user = await authService.updateProfile(userId, req.body);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const result = await authService.changePassword(userId, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
