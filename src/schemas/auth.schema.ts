import z from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(24),
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(24),
  }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RenewTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type RenewTokenInput = z.infer<typeof RenewTokenSchema>;
