import * as z from "zod";
import { isAddress } from "ethers";
import { PublicKey } from "@solana/web3.js";

// Common password validator used across forms
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters");

// Form schema for creating a new password (with confirmation)
export const passwordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreatePasswordFormData = z.infer<typeof passwordSchema>;

// Form schema for verifying an existing password (no confirmation field)
export const verifyPasswordSchema = z.object({
  password: passwordField,
});

export type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;

// Validates whether an Ethereum address is properly formatted
export const isValidEthAddress = (address: string): boolean =>
  isAddress(address);

// Validates whether a Solana address is a valid PublicKey
export const isValidSolAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
