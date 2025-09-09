import { z } from "zod";

export const UserMetaSchema = z.object({
  username: z.string().min(3).max(20),
  imageUrl: z
    .url({ message: "Must be a valid URL" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UserMeta = z.infer<typeof UserMetaSchema>;

export const SignUpSchema = z.object({
  username: UserMetaSchema.shape.username,
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignInSchema = z.infer<typeof SignInSchema>;
