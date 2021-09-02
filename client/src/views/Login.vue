<template>
  <div class="container">
    <div class="card" style="width: 18rem">
      <i class="fas fa-user-circle fa-5x" id="account-icon"></i>
      <div class="card-body">
        <h5 class="card-title mb-5">Log in</h5>
        <div class="mb-3">
          <label for="mailInput" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="mailInput"
            aria-describedby="emailHelp"
            placeholder="example@gmail.com"
            required
          />
        </div>
        <div class="mb-5">
          <label for="passwordInput" class="form-label">Password</label>
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
            id="passwordInput"
            placeholder="password"
            minlength="8"
            required
          />
        </div>
        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="agreeCheck"
            checked
            required
          />
          <label class="form-check-label" for="agreeCheck"
            >I agree to the terms</label
          >
        </div>
        <div class="d-grid gap-2 mb-3">
          <button class="btn btn-primary" @click="formSubmit">Log in</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionTypes } from "@/store/modules/auth/actions.types";
import { Store } from "@/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Login",
  data() {
    return {
      passwordVisible: false,
    };
  },
  methods: {
    async formSubmit() {
      if (
        !(document.getElementById("agreeCheck") as HTMLInputElement).checked
      ) {
        alert("You must agree our terms in order to use our services");
        return;
      }
      let email = (
        document.getElementById("mailInput") as HTMLInputElement
      ).value.toLowerCase();
      let password = (
        document.getElementById("passwordInput") as HTMLInputElement
      ).value;

      await ((this as any).$store as Store).dispatch(ActionTypes.SIGN_IN, {
        email,
        password,
      });

      this.$router.push("/");
    },
    showPassword() {
      (document.getElementById("passwordInput") as HTMLInputElement).type =
        "text";
      this.passwordVisible = true;
    },
    hidePassword() {
      (document.getElementById("passwordInput") as HTMLInputElement).type =
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
