import {z} from "zod"

export const zUserSchema = z.object({
    role_id: z.string(),
    department_id: z.string().nullable(),
    course_id: z.string().nullable(),
    name: z.string(),
    password: z.string(),
    email: z.string().nullable(),
    cpf: z.string(),
    registration: z.string().nullable(),
    phone_number: z.string(),
    address: z.string(),
    isActive: z.boolean()
});

export type zUserSchema = z.infer<typeof zUserSchema>;
