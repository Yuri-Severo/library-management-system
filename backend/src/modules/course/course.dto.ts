import {z} from "zod"

export const zCourseSchema = z.object({
    title: z.string(),
});

export type zCourseSchema = z.infer<typeof zCourseSchema>;
