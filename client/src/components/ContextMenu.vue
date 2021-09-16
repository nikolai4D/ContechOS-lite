<template>
  <div
    class="dropdown-menu dropdown-menu-sm context-menu"
    :id="menuId"
    oncontextmenu="return false"
  >
    <a
      class="dropdown-item"
      href="#"
      v-for="(option, id) in options"
      :key="id"
      @click="option.action($event)"
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
  color: white !important;
  background-color: #3472cf !important;
}
</style>
