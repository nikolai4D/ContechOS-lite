<template>
  <div class="dropdown-menu dropdown-menu-sm" :id="menuId">
    <a
      class="dropdown-item"
      href="#"
      v-for="(option, id) in options"
      :key="id"
      @click="option.action"
      >{{ option.name }}</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContextMenu",
  props: {
    options: Array,
    menuId: String,
  },
});
</script>

<style>
.dropdown-item:active {
  color: white;
}
</style>
