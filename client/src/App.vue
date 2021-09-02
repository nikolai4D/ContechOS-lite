<template>
  <div id="nav">
    <router-link to="/">Home</router-link> <span v-if="!getUser()">| </span>
    <router-link to="/login" v-if="!getUser()">Login</router-link>
    <span v-if="!getUser()"> | </span>
    <router-link to="/signup" v-if="!getUser()">Signup</router-link>
    <span v-if="getUser()">| </span>
    <a @click="signOut" v-if="getUser()" id="log-out">Logout</a>
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ActionTypes } from "./store/modules/auth/actions.types";

export default {
  name: "app",
  methods: {
    signOut: mapActions([ActionTypes.SIGN_OUT]).SIGN_OUT,
    ...mapGetters(["getUser"]),
  },
  created() {
    if (localStorage.getItem("auth.token")) {
      this.$store.dispatch(ActionTypes.FETCH_CURRENT_USER);
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #3472cf;
    }
  }
}

#log-out {
  text-decoration: underline;
}

#log-out:hover {
  cursor: pointer;
}
</style>
