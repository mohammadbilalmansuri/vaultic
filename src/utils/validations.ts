import * as z from "zod";
import { FAUCET_PRESET_AMOUNTS, NETWORKS } from "@/constants";
import { TNetwork } from "@/types";
import { isValidEthereumAddress } from "@/services/ethereum";
import { isValidSolanaAddress } from "@/services/solana";

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

const AddressSchema = (network: string) => {
  switch (network) {
    case "solana":
      return z
        .string()
        .trim()
        .min(32, "Invalid Solana address")
        .max(44, "Invalid Solana address")
        .refine((value) => isValidSolanaAddress(value), {
          message: "Invalid Solana address",
        });
    case "ethereum":
      return z
        .string()
        .trim()
        .length(42, "Invalid Ethereum address")
        .refine((value) => isValidEthereumAddress(value), {
          message: "Invalid Ethereum address",
        });
    default:
      return z.string().trim().min(1, "Address is required");
  }
};

export const SolanaAirdropSchema = z.object({
  address: AddressSchema("solana"),
  amount: z.enum(FAUCET_PRESET_AMOUNTS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an amount" }),
  }),
});

export const SendTransactionSchema = (
  network: TNetwork,
  availableBalance: string
) => {
  return z.object({
    toAddress: AddressSchema(network),
    amount: z
      .string()
      .trim()
      .refine(
        (value) => {
          const num = parseFloat(value);
          return !isNaN(num) && num > 0;
        },
        { message: "Amount must be a positive number" }
      )
      .refine(
        (value) => {
          const num = parseFloat(value);
          const balance = parseFloat(availableBalance);
          const fee = NETWORKS[network].fee;
          return !isNaN(balance) && num <= balance - fee;
        },
        { message: "Insufficient balance" }
      ),
  });
};

export type TCreatePasswordForm = z.infer<typeof CreatePasswordSchema>;
export type TVerifyPasswordForm = z.infer<typeof VerifyPasswordSchema>;
export type TChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
export type TSolanaAirdropForm = z.infer<typeof SolanaAirdropSchema>;
export type TSendTransactionForm = z.infer<
  ReturnType<typeof SendTransactionSchema>
>;
