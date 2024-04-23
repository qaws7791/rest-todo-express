import { Request, Response, NextFunction } from "express";

function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export default asyncHandler;
