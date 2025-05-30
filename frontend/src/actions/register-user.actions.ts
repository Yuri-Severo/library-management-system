'use server';

import { ROUTES } from '@/constants/routes.const';
import { RegisterSchemaType } from '@/schemas/register-user.schema';
import { api } from '@/services/api.service';

export async function registerUserAction({
  data,
}: {
  data: RegisterSchemaType;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Remove o confirmPassword para não enviar ao servidor
    const { confirmPassword, ...cleanData } = data;

    // Log dos dados que serão enviados. Estão indo como null os campos que não foram preenchidos: course_id, department_id, registration. Essa função está dando erro no servidor, pois o servidor não aceita os campos: department_id e course_id como null.
    // Local para verificar: backend => src\modules\user\user.controller.ts
    console.log('Registering user with data: ', cleanData);

    // Mesmo enviando todos os dados, recebo status 500. CPF válido e testado: 529.982.247-25
    const res = await api.post(`${ROUTES.USERS}/user/register`, cleanData);

    return {
      success: true,
      message: `User registered successfully. ${res.status} - ${res.data.message}`,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Unknown error';

    const status = error?.response?.status;

    if (status === 400) {
      return {
        success: false,
        message: `Invalid value. ${message}`,
      };
    }

    if (status === 409) {
      return {
        success: false,
        message: `Conflict. ${message}`,
      };
    }

    return {
      success: false,
      message: `Error registering user. ${message}`,
    };
  }
}
