import { useQuery } from '@tanstack/react-query';
import { getRolesAction, getRolesActionProps } from '@/actions/roles.actions';

export function useRoles(): {
  roles: getRolesActionProps | undefined;
  loadingRoles: boolean;
  errorRoles: boolean;
  refetch: () => void;
} {
  const {
    data: roles,
    isLoading,
    isError,
    refetch,
  } = useQuery<getRolesActionProps>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await getRolesAction();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    retry: false,
  });
  return { roles, loadingRoles: isLoading, errorRoles: isError, refetch };
}
