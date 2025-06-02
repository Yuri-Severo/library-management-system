import {z} from "zod"

export const zBookSchema = z.object({
    title: z.string(),
    code: z.string(),
    isbn: z.string(),
    status: z.string(),
});

export type zBookSchemaType = z.infer<typeof zBookSchema>;
