// import { Request } from "express";

// // Request 인터페이스 확장
// declare module "express" {
//   interface Request {
//     userId: number;
//   }
// }

declare namespace Express {
  export interface Request {
    userId: number;
  }
}
