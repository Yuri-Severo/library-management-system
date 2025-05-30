import z from 'zod';

export const CourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().describe('Course name'),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;
