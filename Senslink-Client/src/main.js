import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsisH,
  faCircle,
  faBars,
  faWater,
  faSolarPanel,
  faBatteryThreeQuarters,
  faSignal,
  faLocationArrow,
  faTachometerAlt,
  faExclamationCircle,
  faBell,
  faTrash,
  faLightbulb,
  faInfoCircle,
  faEdit,
  faMapMarkedAlt,
  faHistory,
  faCogs,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faCircleNotch,
  faStopCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(BootstrapVue);

library.add(
  faEllipsisH,
  faCircle,
  faBars,
  faWater,
  faSolarPanel,
  faBatteryThreeQuarters,
  faSignal,
  faLocationArrow,
  faTachometerAlt,
  faExclamationCircle,
  faBell,
  faTrash,
  faLightbulb,
  faInfoCircle,
  faEdit,
  faMapMarkedAlt,
  faHistory,
  faCogs,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faCircleNotch,
  faStopCircle
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

import { Icon } from "leaflet";

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
