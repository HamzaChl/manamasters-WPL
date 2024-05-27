import { NextFunction, Request, Response } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session.username) {
    next();
  } else {
    res.redirect(`/MagicTheGathering/login`);
  };
};

export function continueLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session.username) {
    res.redirect(`/MagicTheGathering/home`);
  } else {
    next();
  };
};

export function errorHandler(status: number, message: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.render("error", {
      status: status,
      message: message,
    });
  };
};
