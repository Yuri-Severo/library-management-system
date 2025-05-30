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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toast } from '../atoms/toast';
import {
  RegisterSchema,
  RegisterSchemaType,
} from '@/schemas/register-user.schema';
import { PAGES } from '@/enums/pages.enum';
import { registerUserAction } from '@/actions/register-user.actions';
import { Loader } from 'lucide-react';
import { formatPhone } from '@/utils/formatPhone';
import { useRoles } from '@/hooks/use-roles.hook';
import { useCourses } from '@/hooks/use-courses.hook';
import { formatCPF } from '@/utils/formatCPF';

export default function FormRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { roles, loadingRoles } = useRoles();
  const { courses, loadingCourses } = useCourses();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: null,
      password: '',
      confirmPassword: '',
      address: '',
      course_id: null,
      cpf: '',
      department_id: null,
      phone_number: '',
      registration: null,
      role_id: '',
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setLoading(true);

    if (loading) {
      Toast({
        description: 'Aguarde enquanto estamos processando seu login',
        variant: 'loading',
      });
    }

    const response = await registerUserAction({ data });

    if (response.success) {
      Toast({
        variant: 'success',
        description: response.message,
      });
      setLoading(false);
      router.push(PAGES.LOGIN);
    } else {
      Toast({
        variant: 'error',
        description: response.success || response.message,
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex h-full w-full flex-col items-center gap-10'
      >
        <div className='flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-start'>
          <div className='flex w-full flex-col items-center gap-10'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Name</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='text'
                      placeholder='Ex: John Doe'
                      {...field}
                      className='min-w-full text-black'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Email</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='email'
                      placeholder='Ex: johndoe@example.com'
                      {...field}
                      value={field.value ?? ''}
                      className='min-w-full text-black'
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
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Password</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='password'
                      placeholder='Ex: abc123'
                      className='min-w-full text-black'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Confirm your password</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='password'
                      placeholder='Ex: abc123'
                      className='min-w-full text-black'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role_id'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value ?? ''}
                      disabled={loadingRoles}
                      className='min-w-full rounded-md border border-gray-300 px-3 py-2 text-black'
                    >
                      <option value=''>Selecione uma função</option>
                      {roles?.roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}{' '}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex w-full flex-col items-center gap-10'>
            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Phone:</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='tel'
                      placeholder='Ex: (11) 91234-5678'
                      className='min-w-full text-black'
                      {...field}
                      onChange={(e) => {
                        e.target.value = formatPhone(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='cpf'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>CPF:</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      {...field}
                      type='text'
                      placeholder='Ex.: 000.000.000-00'
                      className='min-w-full text-black'
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
              name='address'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Address:</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='text'
                      placeholder='Ex: Example Street, 123'
                      className='min-w-full text-black'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='registration'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Date of Birth:</FormLabel>
                  <FormControl className='w-full'>
                    <Input
                      required
                      type='date'
                      placeholder='Ex: 2000-01-01'
                      className='min-w-full text-black'
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='course_id'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value ?? ''}
                      disabled={loadingCourses}
                      className='min-w-full rounded-md border border-gray-300 px-3 py-2 text-black'
                    >
                      <option value=''>Select your course</option>
                      {courses?.course?.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}{' '}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
