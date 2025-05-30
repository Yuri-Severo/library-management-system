import {z} from "zod"

export const zLoanSchema = z.object({
    book_id: z.string(),
    user_id: z.string(),
    loan_date: z.string(),
    due_date: z.string(),
    returned_date: z.string().nullable(),
    fine_amount: z.number().int(),
    fine_status: z.boolean(),
    status: z.string(),
});

export type zLoanSchema = z.infer<typeof zLoanSchema>;