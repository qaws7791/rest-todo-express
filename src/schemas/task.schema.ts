import z from "zod";
export const GetTaskPaginationSchema = z.object({
  query: z.object({
    cursor: z.string().optional(),
    limit: z.string().optional(),
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
    title: z.string(),
  }),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    done: z.boolean().optional(),
  }),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export const DeleteTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type DeleteTaskInput = z.infer<typeof DeleteTaskSchema>;
