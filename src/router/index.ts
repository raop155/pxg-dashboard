import Vue from 'vue';
import VueRouter from 'vue-router';

// Views
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter: (to: any, from: any, next: any) => {
      if (sessionStorage.getItem('authData')) {
        const authData: any = JSON.parse(sessionStorage.getItem('authData')!);
        if (authData && authData['status'] === true) next('dashboard');
        else next();
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: (to: any, from: any, next: any) => {
      if (sessionStorage.getItem('authData')) {
        const authData: any = JSON.parse(sessionStorage.getItem('authData')!);
        if (authData && authData['status'] === true) next();
        else next('/');
      } else {
        next('/');
      }
    },
    //component: () =>
    // import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
  },
  { path: '*', redirect: '/404' },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/*
router.beforeEach((to, from, next) => {
  if (to.name === 'dashboard') {
    next();
  }
});
*/

/* router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/404');
  } else {
    next();
  }
}); */

export default router;
