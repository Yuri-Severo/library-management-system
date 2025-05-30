'server-only';

import axios from 'axios';
import { ENV } from '@/config/env.config';

export const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});
