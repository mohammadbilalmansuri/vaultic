import * as z from "zod";
import BigNumber from "bignumber.js";
import { NETWORKS, FAUCET_PRESET_AMOUNTS } from "@/constants";
import { TNetwork } from "@/types";

const PasswordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters");

export const CreatePasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().trim(),
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
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

const AddressSchema = (network: TNetwork) => {
  const {
    name,
    functions: { isValidAddress },
  } = NETWORKS[network];
  return z
    .string()
    .trim()
    .min(1, "")
    .refine((v) => isValidAddress(v), `Invalid ${name} address`);
};

export const SolanaAirdropSchema = z.object({
  address: AddressSchema("solana"),
  amount: z.enum(FAUCET_PRESET_AMOUNTS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an amount" }),
  }),
});

export const SendSchema = (network: TNetwork, availableBalance: string) => {
  return z.object({
    toAddress: AddressSchema(network),
    amount: z
      .string()
      .trim()
      .refine((value) => {
        try {
          const amount = new BigNumber(value);
          return amount.isGreaterThan(0) && amount.isFinite();
        } catch {
          return false;
        }
      }, "")
      .refine((value) => {
        try {
          return new BigNumber(value).isLessThanOrEqualTo(
            new BigNumber(availableBalance)
          );
        } catch {
          return false;
        }
      }, "Insufficient balance"),
  });
};

export type TCreatePasswordForm = z.infer<typeof CreatePasswordSchema>;
export type TVerifyPasswordForm = z.infer<typeof VerifyPasswordSchema>;
export type TChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
export type TSolanaAirdropForm = z.infer<typeof SolanaAirdropSchema>;
export type TSendForm = z.infer<ReturnType<typeof SendSchema>>;
