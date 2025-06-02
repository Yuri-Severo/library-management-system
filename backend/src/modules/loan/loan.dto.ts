import { z } from "zod";

export const zLoanSchema = z.object({
  book_id: z.string(),
  user_id: z.string(),
});

export type zLoanSchemaType = z.infer<typeof zLoanSchema>;
