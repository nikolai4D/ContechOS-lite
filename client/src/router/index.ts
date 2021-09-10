import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "@/store";
import Home from "../views/Home.vue";
import Register from "../views/Signup.vue";
import Login from "../views/Login.vue";
import AppPage from "../views/AppPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Register,
  },
  {
    path: "/app",
    name: "AppPage",
    component: AppPage,
    beforeEnter: (to, from, next) => {
      if (!localStorage["auth.token"]) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
