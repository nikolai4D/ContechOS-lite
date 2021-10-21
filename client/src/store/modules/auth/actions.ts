import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations } from "./mutations";
import { ActionTypes } from "./actions.types";
import { MutationTypes } from "./mutations.types";
import { RootState } from "@/store";
import { provideApolloClient, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { apolloClient } from "@/mixins/apollo.mixin";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: any
  ): Promise<void>;
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: any
  ): Promise<void>;
  [ActionTypes.SIGN_OUT](
    { commit }: AugmentedActionContext,
    payload?: undefined
  ): void;
  [ActionTypes.FETCH_CURRENT_USER](
    { commit }: AugmentedActionContext,
    payload: any
  ): Promise<void>;
  [ActionTypes.SET_NEW_PASSWORD](
    { commit }: AugmentedActionContext,
    paylord: any
  ): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.SIGN_IN]({ commit }, payload) {
    return new Promise((resolve, reject) => {
      provideApolloClient(apolloClient);

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($email: String!, $password: String!) {
          signIn(signInInput: { email: $email, password: $password }) {
            user {
              id
              name
              email
            }
            token
          }
        }
      `);

      mutate(payload);

      onDone((result) => {
        localStorage.setItem("auth.token", result.data.signIn.token);

        commit(MutationTypes.SET_USER, result.data.signIn.user);

        resolve();
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);

        reject();
      });
    });
  },
  [ActionTypes.SIGN_UP]({ commit }, payload) {
    return new Promise((resolve, reject) => {
      provideApolloClient(apolloClient);

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($name: String!, $email: String!, $password: String!) {
          createUser(
            createUserInput: { name: $name, email: $email, password: $password }
          ) {
            id
            name
            email
          }

          signIn(signInInput: { email: $email, password: $password }) {
            token
          }
        }
      `);

      mutate(payload);

      onDone((result) => {
        localStorage.setItem("auth.token", result.data.signIn.token);

        commit(MutationTypes.SET_USER, result.data.createUser);

        resolve();
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);

        reject();
      });
    });
  },
  [ActionTypes.SIGN_OUT]({ commit }, payload) {
    localStorage.clear();
    sessionStorage.clear();

    commit(MutationTypes.SET_USER, undefined);
  },
  [ActionTypes.FETCH_CURRENT_USER]({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      provideApolloClient(apolloClient);

      const { mutate, onDone, onError } = useMutation(gql`
        query {
          currentUser {
            id
            name
            email
          }
        }
      `);

      mutate();

      onDone((result) => {
        if (!result.data) {
          return dispatch(ActionTypes.SIGN_OUT);
        }

        commit(MutationTypes.SET_USER, result.data.currentUser);

        resolve();
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);

        dispatch(ActionTypes.SIGN_OUT);

        reject();
      });
    });
  },
  [ActionTypes.SET_NEW_PASSWORD]({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      provideApolloClient(apolloClient);

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($password: String!) {
          updateUser(id: "1", updateUserInput: { password: $password }) {
            user {
              id
              name
              email
            }
          }
        }
      `);

      mutate();

      onDone((result) => {
        if (!result.data) {
          return dispatch(ActionTypes.SIGN_OUT);
        }

        commit(MutationTypes.SET_USER, result.data.currentUser);

        resolve();
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);

        dispatch(ActionTypes.SIGN_OUT);

        reject();
      });
    });
  },
};
