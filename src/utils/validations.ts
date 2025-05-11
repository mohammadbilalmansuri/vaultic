import { FAUCET_PRESET_AMOUNTS } from "@/constants";
import * as z from "zod";

const passwordField = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters");

export const CreatePasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyPasswordSchema = z.object({
  password: passwordField,
});

export const changePasswordSchema = z
  .object({
    currentPassword: passwordField,
    newPassword: passwordField,
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

export const solanaAirdropSchema = z.object({
  address: z
    .string()
    .trim()
    .min(32, { message: "Enter valid Solana wallet address" })
    .max(44, { message: "Invalid Solana wallet address" }),
  amount: z.enum(FAUCET_PRESET_AMOUNTS, {
    errorMap: () => ({ message: "Please select an amount" }),
  }),
});

export type TCreatePasswordFormData = z.infer<typeof CreatePasswordSchema>;
export type TVerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
export type TChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type TSolanaAirdropFormData = z.infer<typeof solanaAirdropSchema>;
