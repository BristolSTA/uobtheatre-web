import axios, { AxiosError } from 'axios';
import useAuthStore from '@/store/auth';
import { silentErrorHandler } from '~~/utils/misc';

export default async function (file: File, name: string | undefined) {
  const endpoint = useRuntimeConfig().public.api.uploadEndpoint;
  const authStore = useAuthStore();
  const formData = new FormData();
  const token = await authStore.getToken();

  formData.append('file', file, name);
  try {
    const result = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${token}`
      }
    });
    return result.data;
  } catch (e) {
    silentErrorHandler(
      e,
      e instanceof AxiosError ? { extra: { response: e.response } } : undefined
    );
    return null;
  }
}
