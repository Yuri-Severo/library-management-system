'use server';

import { ROUTES } from '@/constants/routes.const';
import { RolesSchemaType } from '@/schemas/roles.schema';
import { api } from '@/services/api.service';

export interface getRolesActionProps {
  success: boolean;
  message: string;
  roles?: RolesSchemaType[];
}

export async function getRolesAction(): Promise<getRolesActionProps> {
  try {
    const res = await api.get(`${ROUTES.ROLE}/roles`);

    if (res.status === 404) {
      return {
        success: false,
        message: `Not found. No roles in the database. ${res.status} - ${res.data.message}`,
      };
    }

    return {
      success: true,
      message: `Roles fetched successfully. ${res.status} - ${res.data.message}`,
      roles: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching roles. ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
