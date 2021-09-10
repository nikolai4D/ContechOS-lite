<template>
  <div name="attributes">
    <label for="attributes" class="mb-1">Node Attributes</label>
    <div
      class="row mb-1 attribute"
      v-for="(value, name, id) in attributes"
      :key="id"
    >
      <div class="col-5">
        <input
          type="text"
          class="form-control"
          placeholder="attribute"
          :value="name"
          @change="changeName($event, name, value)"
        />
      </div>
      <div class="col-6">
        <input
          type="text"
          class="form-control"
          placeholder="value"
          name="attribute"
          :value="value"
          @change="changeValue($event, name)"
        />
      </div>
      <div class="col-1">
        <i class="fa fa-trash" @click="removeAttribute(name)"></i>
      </div>
    </div>

    <div @click="addAttribute">
      <i class="fas fa-plus"></i>
      <label for="addAttribute">Add Attribute</label>
    </div>
  </div>
</template>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

i.fa-trash {
  padding-top: 10px;
}

.row {
  --bs-gutter-x: 0;
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

export default defineComponent({
  name: "Attributes",
  data() {
    return {
      attributes: {},
    };
  },
  props: {
    attr: Object,
  },
  watch: {
    attr(newValue, oldValue) {
      this.attributes = newValue
    }
  },
  mounted() {
    this.attributes = this.attr;
  },
  methods: {
    addAttribute() {
      if (!this.attributes[""]) this.attributes[""] = "";
      this.attributesChanged();
    },
    removeAttribute(name) {
      delete this.attributes[name];
      this.attributesChanged();
    },
    changeValue(event, name) {
      if (!this.attributes[name]) this.attributes[name] = event.path[0].value;
      this.attributesChanged();
    },
    changeName(event, name, value) {
      delete this.attributes[name];
      this.attributes[event.path[0].value] = value;
      this.attributesChanged();
    },
    attributesChanged() {
      this.$emit("attributesChanged", this.attributes);
    },
  },
});
</script>
