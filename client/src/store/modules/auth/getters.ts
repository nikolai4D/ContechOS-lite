import { RootState } from "@/store";
import { GetterTree } from "vuex";
import { State } from "./state";

export type Getters = {
  getUser(state: State): any;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getUser: (state) => {
    return state.user;
  },
};
