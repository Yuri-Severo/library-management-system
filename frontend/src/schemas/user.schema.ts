import z from 'zod';

export const UserSchema = z.object({
  role_id: z.string().describe("Foreign key to the user's role"),
  department_id: z.string().nullable(),
  course_id: z.string().nullable(),
  name: z.string(),
  email: z.string().nullable(),
  cpf: z.string(),
  registration: z.string().nullable(),
  phone_number: z.string(),
  address: z.string(),
  password: z
    .string()
    .min(6, 'This password is minimum 6 characters long')
    .describe("User's password"),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
