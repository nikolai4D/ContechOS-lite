<template>
  <div name="labels">
    <label for="node-labels" class="mb-1">Node Labels</label>
    <input
      id="labelInput"
      type="text"
      class="form form-control ml-2 mr-2 mb-3"
      name="node-labels"
      placeholder='divide labels with a ","'
      :value="labels"
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
  mounted() {
    this.labels = this.lbl;
  },
  methods: {
    updateLabels() {
      this.labels = document.getElementById("labelInput").value.split(",");
    },
  },
});
</script>
