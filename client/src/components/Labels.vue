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
  data() {
    return {
      labels: [],
    };
  },
  props: {
    lbl: Array,
  },
  watch: {
    lbl(newValue, oldValue) {
      this.labels = newValue;
    },
  },
  mounted() {
    this.labels = this.lbl;
  },
  methods: {
    updateLabels(event) {
      this.labels = event.target.value
        .split(",")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
      this.$emit("labelsChanged", this.labels);
    },
    getLabels() {
      return this.labels.join(",");
    },
  },
});
</script>
