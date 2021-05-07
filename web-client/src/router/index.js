import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { REFRESH_AUTHENTICATION_DETAILS } from "@/store/modules/authentication/authentication-types";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login-view",
    component: () => import("@/router/views/Login"),
  },

  {
    path: "/dashboard",
    component: () => import("@/router/layouts/Dashboard"),
    children: [
      {
        path: "",
        name: "dashboard-admin-home-view",
        component: () => import("@/router/views/admin/Home"),
      },
      {
        path: "admin",
        name: "dashboard-admin-account-view",
        component: () => import("@/router/views/admin/Account"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch(REFRESH_AUTHENTICATION_DETAILS);
  const authentication = store.state.authentication;
  const isAuthenticated = authentication.isAuthenticated;
  const isProtectedRoute = to.matched.some(
    (record) => record.meta.requiresAuth
  );
  if (isProtectedRoute && !isAuthenticated) return next({ name: "login-view" });
  if (!isProtectedRoute && isAuthenticated)
    return next({ name: "dashboard-admin-home-view" });
  next();
});

export default router;
