import { z } from 'zod';

export const RolesSchema = z.object({
  id: z.string().uuid(),
  title: z.string().describe('Role name'),
});

export type RolesSchemaType = z.infer<typeof RolesSchema>;
