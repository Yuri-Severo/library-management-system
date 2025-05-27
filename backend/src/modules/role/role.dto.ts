import { z } from "zod";

export const zRoleSchema = z.object({
  title: z.string(),
});

export type zRoleSchema = z.infer<typeof zRoleSchema>;
