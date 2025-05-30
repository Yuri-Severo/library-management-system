import { useQuery } from '@tanstack/react-query';
import {
  getCourseAction,
  getCourseActionProps,
} from '@/actions/courses.actions';

export function useCourses(): {
  courses: getCourseActionProps | undefined;
  loadingCourses: boolean;
  errorCourses: boolean;
  refetch: () => void;
} {
  const {
    data: courses,
    isLoading,
    isError,
    refetch,
  } = useQuery<getCourseActionProps>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await getCourseAction();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    retry: false,
  });
  return {
    courses,
    loadingCourses: isLoading,
    errorCourses: isError,
    refetch,
  };
}
