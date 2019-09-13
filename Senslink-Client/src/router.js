import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/landing_page",
      name: "landing_page",
      component: () => import("./views/LandingPage.vue")
    },
    {
      path: "/",
      name: "main",
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem("loggedIn")) {
          next();
        } else {
          next("/landing_page");
        }
      },
      component: () => import("./views/Main.vue")
    }
  ]
});
