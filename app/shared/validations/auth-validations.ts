import type { RegisterOptions } from "react-hook-form";

export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email",
  },
} satisfies RegisterOptions;

export const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 12,
    message: "Password must be at least 12 characters",
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    message: "Password must include at least 1 uppercase letter, 1 number, and 1 symbol",
  },
} satisfies RegisterOptions;
