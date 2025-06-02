import { z } from "zod";

export const zDepartmentSchema = z.object({
  title: z.string(),
});

export type zDepartmentSchema = z.infer<typeof zDepartmentSchema>;
