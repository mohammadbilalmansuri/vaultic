"use client";

import { create } from "zustand";

interface UserState {
  password: string;
  mnemonic: string[];
  isHydrated: boolean;
  login: (password: string, mnemonic: string[]) => Promise<void>;
  logout: () => Promise<void>;
  loadMnemonic: () => Promise<void>;
}
