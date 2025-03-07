import * as z from "zod";

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const verifyPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
