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
          :attr="properties"
          @attributesChanged="changeProperties($event)"
        />
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="editNode"
        >
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
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "EditNode",
  data() {
    return {
      startingPos: { x: null, y: null },
      currentPos: { x: null, y: null },
      isMouseDown: false,
      toggleMenu: true,
      labels: [],
      properties: {},
      activeNodeId: "",
    };
  },
  props: {
    nodeId: String,
    labelsProps: [],
    propertiesProps: {},
  },
  watch: {
    labelsProps(newValue, oldValue) {
      this.labels = newValue;
    },
    propertiesProps(newValue, oldValue) {
      var cleanProperties = this.removeUnnecessaryProperties(newValue);
      this.properties = cleanProperties;
    },
    nodeId(newValue, oldValue) {
      this.activeNodeId = newValue;
    },
  },
  components: {
    Attributes,
    Labels,
    MenuHeader,
  },
  methods: {
    changeProperties(event: any) {
      this.properties = event;
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    removeUnnecessaryProperties(properties: any) {
      delete properties["createdAt"];
      delete properties["id"];
      delete properties["updatedAt"];
      return properties;
    },
    editNode() {
      var properties = this.properties;
      var labels = this.labels;
      var id = this.activeNodeId;

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($labels: [String!]!, $properties: JSONObject, $id: String!) {
          updateNode(
            updateNodeInput: { labels: $labels, properties: $properties }
            id: $id
          ) {
            id
            labels
            properties
          }
        }
      `);

      mutate({ properties: properties, labels: labels, id: id });

      onDone((result) => {
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
