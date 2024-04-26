import { AppError } from "./appError";

const MIN_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

export const parsePaginationParams = (
  page: string | undefined,
  limit: string | undefined
): {
  page: number;
  limit: number;
} | null => {
  const parsedPage = page ? parseInt(page) : MIN_PAGE;
  const parsedLimit = limit ? parseInt(limit) : DEFAULT_LIMIT;
  if (isNaN(parsedPage) || isNaN(parsedLimit)) {
    return null;
  }

  if (
    parsedPage < MIN_PAGE ||
    parsedLimit < MIN_LIMIT ||
    parsedLimit > MAX_LIMIT
  ) {
    return null;
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
};
