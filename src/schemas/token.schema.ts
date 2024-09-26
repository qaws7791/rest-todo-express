import z from "zod";

export const accessTokenSchema = z.object({
  userId: z.number(),
  type: z.literal("access"),
});

export const refreshTokenSchema = z.object({
  userId: z.number(),
  type: z.literal("refresh"),
});
