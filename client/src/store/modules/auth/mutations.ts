import { MutationTree } from "vuex";
import { MutationTypes } from "./mutations.types";
import { State } from "./state";

export type Mutations<S = State> = {
  [MutationTypes.SET_USER](state: S, payload: any | undefined): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER](state, payload) {
    state.user = payload;
  },
};
