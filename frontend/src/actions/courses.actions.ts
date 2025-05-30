'use server';

import { ROUTES } from '@/constants/routes.const';
import { CourseSchemaType } from '@/schemas/course.schema';
import { api } from '@/services/api.service';

export interface getCourseActionProps {
  success: boolean;
  message: string;
  course?: CourseSchemaType[];
}

export async function getCourseAction(): Promise<getCourseActionProps> {
  try {
    const res = await api.get(`${ROUTES.COURSE}/courses`);

    if (res.status === 404) {
      return {
        success: false,
        message: `Not found. No courses in the database. ${res.status} - ${res.data.message}`,
      };
    }

    return {
      success: true,
      message: `Cousers fetched successfully. ${res.status} - ${res.data.message}`,
      course: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching courses. ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
