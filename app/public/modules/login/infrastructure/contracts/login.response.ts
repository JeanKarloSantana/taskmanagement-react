import { z } from "zod";

export const loginResponseSchema = z.record(z.string(), z.unknown());

export type LoginResponse = z.infer<typeof loginResponseSchema>;
