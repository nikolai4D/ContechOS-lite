<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Homepage</h1>
    <p v-if="getUser()">Welcome {{ getUser().name }}</p>
    <p v-if="!getUser()">You are not logged in yet</p>
    <router-link
      to="/app"
      v-if="getUser()"
      class="btn btn-outline-dark"
      id="access-app"
      >Access App</router-link
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Home",
  methods: {
    ...mapGetters(["getUser"]),
  },
});
</script>

<style lang="scss">
* {
  text-align: center;
}

#access-app:hover {
  color: white;
}
</style>
