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

h3 {
  user-select: none;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuHeader",
  props: {
    // data given on creation of component from parent component
    menuName: String,
  },
  mounted() {
    this.parent = this.$el.parentElement.parentElement; // get parent menu component
    this.enableDrag();
  },
  data() {
    // variables used in this component
    return {
      toggleMenu: true,
      parent: null,
    };
  },
  methods: {
    // methods used in this component
    closeElement(event) {
      // triggered when clicked on x
      // hide menu
      this.parent.classList.remove("show");
      this.parent.style.display = "none";
      // reset data
      this.toggleMenu = true;
      // emit event to parent component and return new value of togglemenu
      this.$emit("menuToggle", this.toggleMenu);
    },
    menuToggle(newValue) {
      // triggered whe clicked on toggle triangle
      // reset data
      this.toggleMenu = newValue;
      // emit event to parent component and return new value of togglemenu
      this.$emit("menuToggle", newValue);
    },
    enableDrag() {
      // lets user drag and move the menu from the header
      let x = 0;
      let y = 0;

      let isDragging = false;
      let parent = this.parent;

      const draggableElement = this.$el; // the element that you have to drag to move the menu is the header

      draggableElement.addEventListener("mousedown", () => {
        function update() {
          if (isDragging) {
            requestAnimationFrame(update);
          }
          parent.style.transform = `translate(${x}px, ${y}px)`; // move menu to current mouse position
        }

        isDragging = true;

        requestAnimationFrame(update);
      });

      document.addEventListener("mousemove", (event) => {
        if (!isDragging) {
          return;
        }

        // set x and y to current mouse position
        x = event.clientX;
        y = event.clientY;
      });

      document.addEventListener("mouseup", () => {
        // reset variable
        isDragging = false;
      });
    },
  },
});
</script>
