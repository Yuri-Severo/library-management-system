import z from 'zod';

const envSchema = z.object({
  API_URL: z.string().url({ message: 'API_URL inválida' }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const ENV = _env.data;
