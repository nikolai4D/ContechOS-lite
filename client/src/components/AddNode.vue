<template>
  <nav id="addNode" class="dropdown-menu dropdown-menu-sm inputMenu">
    <div>
      <MenuHeader :menuName="'Add New Node'" @menuToggle="toggleMenu = $event" />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <Labels :lbl="labels" @labelsChanged="changeLabels($event)" />
        <Attributes :attr="properties" @attributesChanged="changeAttributes($event)" />
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="addNode"
        >Add Node</button>
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
    // this activates when this element has the class show
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
  name: "AddNode",
  data() {
    // variables used in this component
    return {
      toggleMenu: true,
      labels: [""],
      properties: { "": "" },
    } as {
      toggleMenu: boolean;
      labels: string[];
      properties: any;
    };
  },
  props: ["layer"],
  components: {
    // child components used
    Attributes,
    Labels,
    MenuHeader,
  },
  methods: {
    // methods used in this component
    changeAttributes(event: any) {
      this.properties = event;
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    addNode() {
      // function that manages the mutation used to create a node
      // remove blank properties, which are the ones that are "": ""
      var properties = Object.entries(this.properties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var labels = Object.assign([], this.labels);
      labels.push(this.layer as string);
      // mutation
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

      mutate({
        // data passed to the mutation
        labels: labels,
        properties: properties,
      });

      onDone((result) => {
        // runs if the mutation executed correctly
        // hide menu
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        // reset data
        this.labels = [""];
        this.properties = { "": "" };

        //emit event to parent component and return the data from the mutation
        this.$emit("addedNode", result.data.createNode);
      });

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
