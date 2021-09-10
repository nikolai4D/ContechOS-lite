<template>
  <nav
    id="addNode"
    class="dropdown-menu dropdown-menu-sm inputMenu"
    style="display: none"
  >
    <div>
      <MenuHeader
        :menuName="'Add New Node'"
        @menuToggle="toggleMenu = $event"
      />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <Labels :lbl="labels" @labelsChanged="changeLabels($event)" />
        <Attributes
          :attr="attributes"
          @attributesChanged="changeAttributes($event)"
        />
        <input
          type="submit"
          class="form form-control btn btn-primary mt-3"
          value="Add Node"
          @click="addNode"
        />
      </ul>
    </div>
  </nav>
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
      attributes: { "": "" },
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
    addNode() {
      var labels = this.labels;
      var properties = this.attributes;

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
        console.log(result);
        console.log(this.$el);
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        this.labels = [""];
        this.attributes = { "": "" };
        this.$emit("addedNode")
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
