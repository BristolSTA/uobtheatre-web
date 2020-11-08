import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import "./assets/styles/app.css";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
