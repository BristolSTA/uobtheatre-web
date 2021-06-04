import { authService } from '@/services'

export default async (context) => {
  await authService.silentRefresh(context)
  window.addEventListener('storage', (event) => {
    if (event.key === 'logout' && authService.isLoggedIn(context)) {
      authService.logout(context, false)
      if (context.route.path !== '/') context.redirect('/')
    }
  })
}
