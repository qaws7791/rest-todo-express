import z from "zod";

const TITLE_MAX_LENGTH = 255;

export const GetTaskPaginationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    query: z.string().optional(),
  }),
});

export type GetTaskPaginationInput = z.infer<typeof GetTaskPaginationSchema>;

export const GetTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type GetTaskInput = z.infer<typeof GetTaskSchema>;

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z.string().max(TITLE_MAX_LENGTH),
  }),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const PutTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().max(TITLE_MAX_LENGTH),
    done: z.boolean(),
  }),
});

export type PutTaskInput = z.infer<typeof PutTaskSchema>;

export const PatchTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().max(TITLE_MAX_LENGTH).optional(),
    done: z.boolean().optional(),
  }),
});

export type PatchTaskInput = z.infer<typeof PatchTaskSchema>;

export const DeleteTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type DeleteTaskInput = z.infer<typeof DeleteTaskSchema>;
