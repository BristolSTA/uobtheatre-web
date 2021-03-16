import NProgress from 'nprogress';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueRouter from 'vue-router';

import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql';
import Login from '@/views/auth/Login.vue';
import { getRoutes } from '@/views/booking/bookingStages';
import NotFoundError from '@/views/errors/NotFound.vue';
import Home from '@/views/Home.vue';
const Venue = () => import('@/views/venues/Venue.vue');
const Society = () => import('@/views/societies/Society.vue');

import { auth as authMiddleware } from '@/middleware';
import { authService } from '@/services';

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

  {
    path: '/productions',
    component: () => import('@/views/production/UpcomingProductions.vue'),
    name: 'productions',
  },

  /**
   * Create Booking Pages
   */
  Bindings.routeWithBindings(
    {
      path: '/production/:productionSlug/book/:performanceID?',
      component: () => import('@/views/booking/Book.vue'),
      children: getRoutes(),
      meta: {
        middleware: [authMiddleware],
      },
    },
    [Bindings.bindProductionSlug()]
  ),

  /**
   * User Pages
   */
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/MyAccount.vue'),
    meta: {
      middleware: [authMiddleware],
    },
  },

  {
    path: '/user/emailChange/:token',
    props: true,
    name: 'user.emailChange',
    component: () => import('@/views/user/EmailChangeActivate.vue'),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: '/user/booking/:bookingRef',
    name: 'user.booking',
    component: () => import('@/views/user/ViewBooking.vue'),
    meta: {
      middleware: [authMiddleware],
    },
  },

  /**
   * Venue Pages
   */
  {
    path: '/venues/:venueSlug',
    name: 'venue',
    component: Venue,
  },

  /**
   * Society Pages
   */
  {
    path: '/societies/:societySlug',
    name: 'society',
    component: Society,
  },

  {
    path: '/societies',
    component: () => import('@/views/societies/AllSocieties.vue'),
    name: 'societies',
  },

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
  {
    path: '/login/forgot',
    name: 'login.forgot',
    component: () => import('@/views/auth/ForgotPassword.vue'),
  },
  {
    path: '/login/activate/:activationToken',
    props: true,
    name: 'login.activate',
    component: () => import('@/views/auth/ActivateAccount.vue'),
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
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

// Apply any middleware
router.beforeEach((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  authService.refreshAuthStatus();
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
