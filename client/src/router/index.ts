import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Data from "@/views/Data.vue";
import Config from "@/views/Config.vue";

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
    path: "/data",
    name: "Data",
    component: Data,
    beforeEnter: (to, from, next) => {
      if (!localStorage["auth.token"]) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/config",
    name: "Config",
    component: Config,
    beforeEnter: (to, from, next) => {
      if (!localStorage["auth.token"]) {
        next("/");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
