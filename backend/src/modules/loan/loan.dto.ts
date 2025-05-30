import { z } from "zod";

export const zLoanSchema = z.object({
  bookId: z.string(),
  userId: z.string(),
  loanDate: z.string(),
  dueDate: z.string(),
  returnedDate: z.string().nullable(),
  fineAmount: z.string(),
  fineStatus: z.boolean(),
  status: z.string(),
});

export type zLoanSchemaType = z.infer<typeof zLoanSchema>;
