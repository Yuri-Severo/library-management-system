import {z} from "zod"

export const zUserSchema = z.object({
    role_id: z.string(),
    department_id: z.string().nullable().default(null),
    course_id: z.string().nullable().default(null),
    name: z.string(),
    password: z.string(),
    email: z.string().nullable(),
    cpf: z.string(),
    registration: z.string().nullable(),
    phone_number: z.string(),
    address: z.string(),
});

export const zUserUpdateSchema = z.object({
    role_id: z.string(),
    department_id: z.string().nullable(),
    course_id: z.string().nullable(),
    name: z.string(),
    password: z.string(),
    email: z.string().nullable(),
    registration: z.string().nullable(),
    phone_number: z.string(),
    address: z.string(),
    isActive: z.boolean()
});

export type zUserSchemaType = z.infer<typeof zUserSchema>;
export type zUserUpdateSchemaType = z.infer<typeof zUserUpdateSchema>;
export const zUserPartialUpdateSchema = zUserUpdateSchema.partial()

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let firstCheckDigit = (sum * 10) % 11;
  if (firstCheckDigit === 10) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  let secondCheckDigit = (sum * 10) % 11;
  if (secondCheckDigit === 10) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cleaned[10])) return false;

  return true;
}
