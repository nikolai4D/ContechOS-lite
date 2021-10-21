<template>
  <div class="container">
    <div class="card" style="width: 18rem">
      <i class="fas fa-user-circle fa-5x" id="account-icon"></i>
      <form class="card-body" @submit.prevent="formSubmit">
        <h5 class="card-title mb-5">Forgot Password, Set new one</h5>
        <div class="mb-5">
          <label for="passwordInput1" class="form-label">Password</label>
          <i
            class="far fa-eye"
            v-if="passwordVisible"
            @click="hidePassword"
          ></i>
          <i
            class="far fa-eye-slash"
            v-if="!passwordVisible"
            @click="showPassword"
          ></i>
          <input
            type="password"
            class="form-control"
            id="passwordInput1"
            placeholder="password"
            minlength="8"
            required
          />
        </div>
        <div class="mb-5">
          <label for="passwordInput2" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="passwordInput2"
            placeholder="password"
            minlength="8"
            required
          />
        </div>
        <div class="d-grid gap-2 mb-3">
          <button class="btn btn-primary">Set New Password</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionTypes } from "@/store/modules/auth/actions.types";
import { Store } from "@/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "SetNewPassword",
  data() { // variables used in this component
    return {
      passwordVisible: false,
    };
  },
  methods: { // methods used in this component
    async formSubmit() {
      let password1 = (
        document.getElementById("passwordInput1") as HTMLInputElement
      ).value;
      let password2 = (
        document.getElementById("passwordInput2") as HTMLInputElement
      ).value;
      if (
        password1 !== password2
      ) {
        alert("Passwords must match");
        return;
      }

      await ((this as any).$store as Store).dispatch(ActionTypes.SET_NEW_PASSWORD, {
        password1,
      });

      this.$router.push("/");
    },
    showPassword() {
      (document.getElementById("passwordInput1") as HTMLInputElement).type =
        "text";
      (document.getElementById("passwordInput2") as HTMLInputElement).type =
        "text";
      this.passwordVisible = true;
    },
    hidePassword() {
      (document.getElementById("passwordInput1") as HTMLInputElement).type =
        "password";
      (document.getElementById("passwordInput2") as HTMLInputElement).type =
        "password";
      this.passwordVisible = false;
    },
  },
});
</script>

<style>
#account-icon {
  padding: 15%;
  padding-bottom: 0;
  color: gray;
}
* {
  margin: 0 auto;
}
.far {
  margin-left: 10px;
  width: 20px;
}
</style>
