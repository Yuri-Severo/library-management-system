'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, LoginSchemaType } from '@/schemas/login.schema';
import { loginAction } from '@/actions/login.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toast } from '../atoms/toast';
import { PAGES } from '@/enums/pages.enum';
import { Loader } from 'lucide-react';
import { formatCPF } from '@/utils/formatCPF';

export default function FormsLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      cpf: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);

    if (loading) {
      Toast({
        description: 'Aguarde enquanto estamos processando seu login',
        variant: 'loading',
      });
    }

    const response = await loginAction({ data });

    if (response.success) {
      Toast({
        variant: 'success',
        description: 'Login realizado com sucesso',
      });

      setLoading(false);
      router.push(PAGES.HOME_AUTH);
    } else {
      Toast({
        variant: 'error',
        description: response.message,
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col items-center gap-10'
      >
        <FormField
          control={form.control}
          name='cpf'
          render={({ field }) => (
            <FormItem className='flex w-fit flex-col'>
              <FormLabel>cpf</FormLabel>
              <FormControl className='w-full'>
                <Input
                  type='cpf'
                  placeholder='Ex: 012.345.678-90'
                  {...field}
                  className='text-black'
                  value={formatCPF(field.value ?? '')}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='flex w-fit flex-col'>
              <FormLabel>Password</FormLabel>
              <FormControl className='w-full'>
                <Input
                  type='password'
                  placeholder='Ex: abc123'
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    form.clearErrors('password');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full max-w-60 cursor-auto self-center'
          disabled={loading || !form.formState.isValid}
          variant={loading ? 'loading' : 'default'}
        >
          {loading ? <Loader className='h-5 w-5 animate-spin' /> : 'submit'}
        </Button>
      </form>
    </Form>
  );
}
