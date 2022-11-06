import axios from 'axios';
import { useStore } from '~~/store/auth';

export default async function (file: File, name: string | undefined) {
  const endpoint = useRuntimeConfig().public.api.uploadEndpoint;
  const authStore = useStore();
  const formData = new FormData();
  formData.append('file', file, name);
  const result = await axios.post(endpoint, formData, {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `JWT ${authStore.token}`
    }
  });
  return result.data;
}
