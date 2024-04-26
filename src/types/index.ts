import { Request as ExpressRequest } from "express";

type CRequest = {
  params?: ExpressRequest["params"];
  body?: ExpressRequest["body"];
  query?: ExpressRequest["query"];
};

type EnsureParams<T extends CRequest> = "params" extends keyof T
  ? T["params"]
  : any;
type EnsureBody<T extends CRequest> = "body" extends keyof T ? T["body"] : any;
type EnsureQuery<T extends CRequest> = "query" extends keyof T
  ? T["query"]
  : any;

export interface CustomRequest<T extends CRequest>
  extends ExpressRequest<EnsureParams<T>, any, EnsureBody<T>, EnsureQuery<T>> {}

export interface Pagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  lastPage: number;
  limit: number;
}

export interface HateoasLinks {
  rel: string;
  href: string;
  action?: string;
  types?: string[];
}
