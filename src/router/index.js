import NProgress from 'nprogress';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueRouter from 'vue-router';

import Login from '@/views/auth/Login.vue';
import { getRoutes } from '@/views/booking/bookingStages';
import NotFoundError from '@/views/errors/NotFound.vue';
import Home from '@/views/Home.vue';
import ProductionPageQuery from '@/views/production/Production.gql';
const Venue = () => import('@/views/venues/Venue.vue');
const Society = () => import('@/views/societies/Society.vue');

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
    [Bindings.bindProductionSlug(ProductionPageQuery)]
  ),
  Bindings.routeWithBindings(
    {
      path: '/production/:productionSlug/book/:performanceID?',
      component: () => import('@/views/booking/Book.vue'),
      children: getRoutes(),
    },
    [Bindings.bindProductionSlug()]
  ),

  /**
   * Venue Pages
   */
  {
    path: '/venues/:venueSlug',
    name: 'venue',
    component: Venue,
  },

  /**
   * Auth Pages
   */
  {
    path: '/societies/:societySlug',
    name: 'society',
    component: Society,
  },
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash,
      };
    } else {
      return { x: 0, y: 0 };
    }
  },
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
