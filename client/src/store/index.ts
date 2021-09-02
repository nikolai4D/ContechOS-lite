import { createStore } from "vuex";
import { store as auth, AuthStore, State as AuthState } from "./modules/auth";

export type RootState = {
  auth: AuthState;
};

export type Store = AuthStore<Pick<RootState, "auth">>;

const store = createStore({
  modules: {
    auth,
  },
});

export function useStore(): Store {
  return store as Store;
}

export default store;
