import * as z from "zod";
import { isAddress } from "ethers";
import { PublicKey } from "@solana/web3.js";

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const passwordSchema = z
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

export const isValidEthAddress = (address: string): boolean =>
  isAddress(address);

export const isValidSolAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export type TCreatePasswordFormData = z.infer<typeof passwordSchema>;

export type TVerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
