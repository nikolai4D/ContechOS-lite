<template>
  <div name="labels">
    <label for="node-labels" class="mb-1">Node Labels</label>
    <input
      id="labelInput"
      type="text"
      class="form form-control ml-2 mr-2 mb-3"
      name="node-labels"
      placeholder='divide labels with a ","'
      :value="getLabels()"
      @change="updateLabels($event)"
    />
  </div>
</template>

<style scoped>
.row {
  --bs-gutter-x: 0;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Labels",
  data() { // variables used in this component
    return {
      labels: [],
    };
  },
  props: { // data given on creation of component from parent component
    lbl: Array,
  },
  watch: { // executes when the value of the given prop changes on the parent element
    lbl(newValue, oldValue) {
      this.labels = newValue;
    },
  },
  mounted() {
    this.labels = this.lbl;
  },
  methods: { // methods used in this component
    updateLabels(event) {
      // make a list out of the labels input value
      this.labels = event.target.value
        .split(",")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

      //emit event to parent component and return the updated labels
      this.$emit("labelsChanged", this.labels);
    },
    getLabels() { // turn labels list into string
      return this.labels.join(",");
    },
  },
});
</script>
