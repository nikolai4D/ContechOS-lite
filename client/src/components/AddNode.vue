<template>
  <div>
    <nav
      id="addNode"
      class="dropdown-menu dropdown-menu-sm inputMenu"
      style="display: none"
    >
      <form action="">
        <MenuHeader :menuName="'Add New Node'" @menuToggle="toggleMenu=$event" />
        <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
          <Labels :lbl="labels" />
          <Attributes :attr="attributes" />
          <input
            type="submit"
            class="form form-control btn btn-primary mt-3"
            value="Add Node"
          />
        </ul>
      </form>
    </nav>
  </div>
</template>

<style scoped>
#addNode {
  background: white;
  box-shadow: 0px 0px 15px black;
  width: 20%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Attributes from "./Attributes.vue";
import Labels from "./Labels.vue";
import MenuHeader from "./MenuHeader.vue";

export default defineComponent({
  name: "AddNode",
  data() {
    return {
      startingPos: { x: null, y: null },
      currentPos: { x: null, y: null },
      isMouseDown: false,
      toggleMenu: true,
      labels: [],
      attributes: [{ name: "", value: "" }],
    };
  },
  components: {
    Attributes,
    Labels,
    MenuHeader,
  },
});
</script>
