import * as z from "zod";

// Create Password Validation

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

// Verify Password Validation

export const verifyPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;

// Address Validation

import { isAddress } from "ethers";
import { PublicKey } from "@solana/web3.js";

export const isValidEthAddress = (address: string) => isAddress(address);
export const isValidSolAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
