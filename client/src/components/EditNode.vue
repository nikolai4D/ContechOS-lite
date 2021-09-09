<template>
  <div>
    <nav
      id="editNode"
      class="dropdown-menu dropdown-menu-sm inputMenu"
      style="display: none"
    >
      <form action="">
        <div class="sidebar-header row">
          <i
            class="fas fa-caret-right col-sm-2"
            v-if="toggleMenu"
            @click="toggleMenu = false"
          ></i>
          <i
            class="fas fa-caret-down col-sm-2"
            v-if="!toggleMenu"
            @click="toggleMenu = true"
          ></i>
          <h3 id="addNodeHeader" class="col-sm-8">Edit Node</h3>
          <i class="fas fa-times col-sm-2" @click="closeElement"></i>
        </div>
        <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
          <label for="node-labels" class="mb-1">Node Labels</label>
          <input
            type="text"
            class="form form-control ml-2 mr-2 mb-3"
            name="node-labels"
            placeholder='divide labels with a ","'
          />
          <label for="attributes" class="mb-1">Node Attributes</label>
          <Attributes />
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
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

i.fas {
  padding: 3%;
  font-size: 1.2em;
}
i.fa-trash {
  padding-top: 10px;
}

.row {
  --bs-gutter-x: 0;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

#editNode {
  /* don't forget to add all the previously mentioned styles here too */
  background: white;
  box-shadow: 0px 0px 15px black;
  transition: all 0.3s;
  width: 20%;
  display: block;
  position: absolute;
  top: 30%;
  right: 2%;
}

#sidebar h3 {
  color: white;
}

#sidebar ul.components {
  padding: 20px 0;
}

#sidebar ul p {
  color: black;
  padding: 10px;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}
#sidebar ul li a:hover {
  color: #3472cf;
  background: #fff;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #3472cf;
}
ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #3472cf;
}
.col-6:first-of-type {
  padding-right: 1%;
}
.col-6:nth-child(2) {
  padding-left: 1%;
}
</style>

<script>
import { defineComponent } from "vue";
import Attributes from "./Attributes.vue";

export default defineComponent({
  name: "EditNode",
  data() {
    return {
      startingPos: { x: null, y: null },
      currentPos: { x: null, y: null },
      isMouseDown: false,
      toggleMenu: true,
      attributes: [{ name: "name", value: "luke" }],
    };
  },
  mounted() {
    // this.enableDrag();
  },
  components: {
    Attributes,
  },
  methods: {
    closeElement() {
      document.getElementById("editNode").classList.remove("show");
      document.getElementById("editNode").style.display = "none";
      this.toggleMenu = true;
    },
  },
});
</script>
