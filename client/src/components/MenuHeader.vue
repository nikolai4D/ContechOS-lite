<template>
  <div class="sidebar-header row" id="header">
    <i
      class="fas fa-caret-right col-sm-2"
      v-if="toggleMenu"
      @click="menuToggle(false)"
    ></i>
    <i
      class="fas fa-caret-down col-sm-2"
      v-if="!toggleMenu"
      @click="menuToggle(true)"
    ></i>
    <h3 class="col-sm-8">{{ menuName }}</h3>
    <i class="fas fa-times col-sm-2" @click="closeElement($event)"></i>
  </div>
</template>

<style scoped>
i.fas {
  padding: 3%;
  font-size: 1.2em;
}
.row {
  --bs-gutter-x: 0;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuHeader",
  props: {
    menuName: String,
  },
  mounted() {
    this.enableDrag();
    console.log(this.$parent.$parent.$parent);
  },
  data() {
    return {
      toggleMenu: true,
      parent: null,
    };
  },
  methods: {
    closeElement(event) {
      this.parent = event.target.parentElement.parentElement.parentElement;
      this.parent.classList.remove("show");
      this.parent.style.display = "none";
      this.toggleMenu = true;
    },
    menuToggle(newValue) {
      this.toggleMenu = newValue;
      this.$emit("menuToggle", newValue);
    },
    enableDrag() {
      let x = 0;
      let y = 0;

      let isDragging = false;

      const draggableElement = document.getElementById("header");

      draggableElement.addEventListener("mousedown", () => {
        function update() {
          if (isDragging) {
            requestAnimationFrame(update);
          }

          document.getElementById(
            "addNode"
          ).style.transform = `translate(${x}px, ${y}px)`;
        }

        isDragging = true;

        requestAnimationFrame(update);
      });

      document.addEventListener("mousemove", (event) => {
        if (!isDragging) {
          return;
        }

        x = event.clientX;
        y = event.clientY;
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
    },
  },
});
</script>
