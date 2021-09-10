<template>
  <nav
    id="editNode"
    class="dropdown-menu dropdown-menu-sm inputMenu"
    style="display: none"
  >
    <div>
      <MenuHeader :menuName="'Edit Node'" @menuToggle="toggleMenu = $event" />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <Labels :lbl="labels" @labelsChanged="changeLabels($event)" />
        <Attributes
          :attr="attributes"
          @attributesChanged="changeAttributes($event)"
        />
        <button type="submit" class="form form-control btn btn-primary mt-3">
          Edit Node
        </button>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
#editNode {
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
  name: "EditNode",
  data() {
    return {
      startingPos: { x: null, y: null },
      currentPos: { x: null, y: null },
      isMouseDown: false,
      toggleMenu: true,
      labels: ["User", "Admin"],
      attributes: { name: "luke" },
    };
  },
  components: {
    Attributes,
    Labels,
    MenuHeader,
  },
  methods: {
    changeAttributes(event: any) {
      this.attributes = event;
    },
    changeLabels(event: any) {
      this.labels = event;
    },
  },
});
</script>
