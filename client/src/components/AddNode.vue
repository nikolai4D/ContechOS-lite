<template>
  <nav id="addNode" class="dropdown-menu dropdown-menu-sm inputMenu">
    <div>
      <MenuHeader
        :menuName="'Add New Node'"
        @menuToggle="toggleMenu = $event"
      />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <Labels :lbl="labels" @labelsChanged="changeLabels($event)" />
        <Attributes
          :attr="properties"
          @attributesChanged="changeAttributes($event)"
        />
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="addNode"
        >
          Add Node
        </button>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
#addNode {
  background: white;
  box-shadow: 0px 0px 15px black;
  width: 20%;
  display: none;
  position: absolute;
  top: 0;
  left: 0;

  &.show {
    display: block;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Attributes from "./Attributes.vue";
import Labels from "./Labels.vue";
import MenuHeader from "./MenuHeader.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "AddNode",
  data() {
    return {
      startingPos: { x: null, y: null },
      currentPos: { x: null, y: null },
      isMouseDown: false,
      toggleMenu: true,
      labels: [""],
      properties: {"": "" },
    };
  },
  components: {
    Attributes,
    Labels,
    MenuHeader,
  },
  methods: {
    changeAttributes(event: any) {
      this.properties = event;
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    addNode() {
      var labels = this.labels;
      var properties = Object.entries(this.properties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($labels: [String!]!, $properties: JSONObject!) {
          createNode(
            createNodeInput: { labels: $labels, properties: $properties }
          ) {
            id
            labels
            properties
          }
        }
      `);

      mutate({ labels: labels, properties: properties });

      onDone((result) => {
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        this.labels = [""];
        this.properties = { "": "" };
        this.$emit("addedNode");
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
