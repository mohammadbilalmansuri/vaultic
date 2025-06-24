import * as z from "zod";
import BigNumber from "bignumber.js";
import { NETWORKS, NETWORK_FUNCTIONS } from "@/config";
import { FAUCET_PRESET_AMOUNTS } from "@/constants";
import { TNetwork } from "@/types";

// Base password validation schema (8-128 characters)
const PasswordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters");

// Creates network-specific address validation schema
const AddressSchema = (network: TNetwork) => {
  return z
    .string()
    .trim()
    .min(1, "")
    .refine(
      (value) => NETWORK_FUNCTIONS[network].isValidAddress(value),
      `Invalid ${NETWORKS[network].name} address`
    );
};

/**
 * Schema for creating a new password with confirmation.
 */
export const CreatePasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Schema for verifying an existing password.
 */
export const VerifyPasswordSchema = z.object({
  password: PasswordSchema,
});

/**
 * Schema for changing password with current and new password validation.
 */
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

/**
 * Schema for Solana testnet airdrop requests.
 */
export const SolanaAirdropSchema = z.object({
  address: AddressSchema("solana"),
  amount: z.enum(FAUCET_PRESET_AMOUNTS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an amount" }),
  }),
});

/**
 * Creates a schema for sending transactions with network-specific validation.
 * @param network - Target blockchain network
 * @param availableBalance - Available balance to validate against
 */
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
