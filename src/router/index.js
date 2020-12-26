import NProgress from 'nprogress';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueRouter from 'vue-router';

import Login from '@/views/auth/Login.vue';
import { getRoutes } from '@/views/booking/bookingStages';
import NotFoundError from '@/views/errors/NotFound.vue';
import Home from '@/views/Home.vue';

import * as Bindings from './bindings';

Vue.use(VueRouter);
Vue.use(Meta);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },

  /**
   * Production Pages
   */
  Bindings.routeWithBindings(
    {
      path: '/production/:productionSlug',
      name: 'production',
      component: () => import('@/views/production/Production.vue'),
    },
    [Bindings.bindProductionSlug]
  ),
  Bindings.routeWithBindings(
    {
      path: '/production/:productionSlug/book/:performanceID?',
      component: () => import('@/views/booking/Book.vue'),
      children: getRoutes(),
    },
    [Bindings.bindProductionSlug]
  ),

  /**
   * Auth Pages
   */
  {
    path: '/login',
    name: 'login',
    component: Login,
    props: { login: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: Login,
    props: { login: false },
  },

  /**
   * Error and Wildcard Pages
   */
  { path: '/404', name: '404', component: NotFoundError },
  { path: '*', redirect: '/404' },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// Apply any middleware
router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

// Set up navigation guards for loading stuff
router.beforeResolve((to, _from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.

// eslint-disable-next-line
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

export default router;
