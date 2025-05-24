import * as z from "zod";
import { FAUCET_PRESET_AMOUNTS } from "@/constants";

const PasswordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters");

export const CreatePasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const VerifyPasswordSchema = z.object({
  password: PasswordSchema,
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const SolanaAirdropSchema = z.object({
  address: z
    .string()
    .trim()
    .min(32, { message: "Enter a valid Solana address" })
    .max(44, { message: "Invalid Solana address" }),
  amount: z.enum(FAUCET_PRESET_AMOUNTS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an amount" }),
  }),
});

export type TCreatePasswordForm = z.infer<typeof CreatePasswordSchema>;
export type TVerifyPasswordForm = z.infer<typeof VerifyPasswordSchema>;
export type TChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
export type TSolanaAirdropForm = z.infer<typeof SolanaAirdropSchema>;
