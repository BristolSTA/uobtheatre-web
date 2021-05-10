import { authService } from '@/services'

export default (context) => {
  authService.refreshAuthUser(context)
}
