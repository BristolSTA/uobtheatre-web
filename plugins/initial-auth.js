import { authService } from '@/services'

export default async (context) => {
  await authService.rememberUser(context)
}
