import { createApolloProvider } from "@vue/apollo-option";
import { createApp } from "vue";
import App from "./App.vue";
import { apolloClient } from "./mixins/apollo.mixin";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueKeycloakJs from "@dsb-norge/vue-keycloak-js";
import { KeycloakInstance } from "keycloak-js";
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

createApp(App)
  .use(VueKeycloakJs, {
    init: {
      onLoad: "login-required",
      redirectUri: window.location.origin,
    },
    config: {
      url: "http://127.0.0.1:8080/auth",
      clientId: "app-vue",
      realm: "myrealm",
    },
    onReady(keycloak: KeycloakInstance) {
      console.log("Keycloak ready", keycloak);
    },
  })
  .use(store)
  .use(router)
  .use(apolloProvider)
  .mount("#app");

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance;
  }
}
