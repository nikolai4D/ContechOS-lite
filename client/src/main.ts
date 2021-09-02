import { createApolloProvider } from "@vue/apollo-option";
import { createApp } from "vue";
import App from "./App.vue";
import { apolloClient } from "./mixins/apollo.mixin";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

createApp(App).use(store).use(router).use(apolloProvider).mount("#app");
