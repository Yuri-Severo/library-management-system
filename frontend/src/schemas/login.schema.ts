import z from 'zod';

export const loginSchema = z.object({
  cpf: z.string().length(14, 'CPF must be 11 characters long'),
  password: z.string().min(6, 'The password is less than 6 characters'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
