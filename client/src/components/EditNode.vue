<template>
  <nav id="editNode" class="dropdown-menu dropdown-menu-sm inputMenu">
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

<style lang="scss" scoped>
#editNode {
  background: white;
  box-shadow: 0px 0px 15px black;
  width: 20%;
  display: none;
  position: absolute;
  top: 0;
  left: 0;

  &.show { // this activates when this element has the class show
    display: block;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Attributes from "./Attributes.vue";
import Labels from "./Labels.vue";
import MenuHeader from "./MenuHeader.vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "EditNode",
  data() { // variables used in this component
    return {
     
     
      toggleMenu: true,
      labels: [],
      properties: {},
      activeNodeId: "",
    };
  },
  props: { // data given on creation of component from parent component
    nodeId: String,
    labelsProps: Array,
    propertiesprops: {}
  },
  watch: { // executes when the value of the given prop changes on the parent element
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
  components: { // child components used
    Attributes,
    Labels,
    MenuHeader,
  },
  methods: { // methods used in this component
    changeProperties(event: any) {
      this.properties = event;
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    removeUnnecessaryProperties(properties: { [key: string]: any }) { 
      // remove server properties that don't have to be displayed to the user
      return Object.entries(properties)
        .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
    },
    editNode() { // function that manages the mutation used to edit a node
      // remove blank properties, which are the ones that are "": ""
      var properties = this.properties;
      properties = Object.entries(properties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var labels = this.labels;
      var id = this.activeNodeId;

      // mutation
      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($labels: [String!]!, $properties: JSONObject, $id: String!) {
          updateNode(
            updateNodeInput: { labels: $labels, properties: $properties }
            id: $id
          ) {
            labels
            properties
          }
        }
      `);

      mutate({ // data passed to the mutation
        properties: properties, labels: labels, id: id 
      });

      
      onDone((result) => { // runs if the mutation executed correctly
        // hide menu
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        
        //emit event to parent component and return the data from the mutation
        this.$emit("editedNode", {
          id,
          ...result.data.updateNode,
        });
      });

      onError((result) => { // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
