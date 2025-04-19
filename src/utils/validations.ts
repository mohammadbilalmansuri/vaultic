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

export const importWalletSchema = z.object({
  mnemonic: z
    .array(z.string().min(1, "Each word must be non-empty"))
    .refine((mnemonic) => mnemonic.length === 12 || mnemonic.length === 24, {
      message: "Mnemonic must contain either 12 or 24 words",
    }),
});

export type TCreatePasswordFormData = z.infer<typeof CreatePasswordSchema>;
export type TVerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
export type TImportWalletFormData = z.infer<typeof importWalletSchema>;
export type TChangePasswordFormData = z.infer<typeof changePasswordSchema>;
