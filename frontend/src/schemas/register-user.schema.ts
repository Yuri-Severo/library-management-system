import z from 'zod';

export const RegisterSchema = z
  .object({
    role_id: z
      .string({ required_error: 'Select your role' })
      .describe("Foreign key to the user's role"),
    department_id: z.string().nullable(),
    course_id: z.string().nullable(),
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, 'Name must be at least 3 characters long'),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email' })
      .nullable(),
    cpf: z.string().length(11, 'CPF must be 11 characters long'),
    registration: z.string().nullable(),
    phone_number: z.string(),
    address: z.string(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'This password is minimum 6 characters long')
      .describe("User's password"),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
