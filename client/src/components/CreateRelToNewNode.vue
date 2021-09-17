<template>
  <nav id="createRelToNewNode" class="dropdown-menu dropdown-menu-sm inputMenu">
    <div>
      <MenuHeader
        :menuName="'Create Relationship to New Node'"
        @menuToggle="toggleMenu = $event"
      />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <div class="mb-5 mt-3">
          <h4>Relationship Properties</h4>
          <div class="mb-3">
            <label for="rel-name" class="mb-1">Relationship Name</label>
            <input
              type="text"
              placeholder="relationship name"
              class="form-control"
              @change="changeName($event)"
              :value="relationshipName"
            />
          </div>
          <Attributes
            :attr="relationProperties"
            @attributesChanged="changeProperties($event)"
          />
        </div>
        <div class="mb-3">
          <h4>Node Properties</h4>
          <Labels :lbl="labels" @labelsChanged="changeLabels($event)" />
          <Attributes
            :attr="nodeProperties"
            @attributesChanged="changeAttributes($event)"
          />
        </div>
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="addNodeAndRel"
        >
          Add Node and Relationship
        </button>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
#createRelToNewNode {
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
  name: "RelationshipToNewNode",
  data() {
    // variables used in this component
    return {
      toggleMenu: true,
      labels: [""],
      nodeProperties: { "": "" },
      relationProperties: { "": "" },
      relationshipName: "",
      activeElementId: "",
      targetElementId: "",
    };
  },
  components: {
    // child components used
    Attributes,
    Labels,
    MenuHeader,
  },
  props: {
    // data given on creation of component from parent component
    activeElmntId: String,
    targetElmntId: String,
  },
  watch: {
    // executes when the value of the given prop changes on the parent element
    activeElmntId(newValue, oldValue) {
      this.activeElementId = newValue;
    },
    targetElmntId(newValue, oldValue) {
      this.targetElementId = newValue;
    },
  },
  methods: {
    // methods used in this component
    changeAttributes(event: any) {
      this.nodeProperties = { ...this.nodeProperties, ...event }; // joins the data from the two Objs
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    changeProperties(event: any) {
      this.relationProperties = { ...this.relationProperties, ...event }; // joins the data from the two Objs
    },
    changeName(event: any) {
      this.relationshipName = event.path[0].value.toUpperCase();
    },
    addNodeAndRel() {
      // function that manages the mutation used to create a node and a relationship to this node
      var nodeLabels = this.labels;
      // remove blank node properties, which are the ones that are "": ""
      var nodeProperties = Object.entries(this.nodeProperties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var relName = this.relationshipName;
      // remove blank relation properties, which are the ones that are "": ""
      var relProperties = Object.entries(this.relationProperties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var relSource = this.activeElementId;

      // mutation to create node
      const {
        mutate: createNode,
        onDone: onCreateNodeDone,
        onError: onCreateNodeError,
      } = useMutation(gql`
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

      createNode({
        // data passed to the mutation
        labels: nodeLabels,
        properties: nodeProperties,
      });

      onCreateNodeDone((nodeResult) => {
        // runs if the mutation executed correctly
        // this.$el.classList.remove("show");
        // this.$el.style.display = "none";

        const target = nodeResult.data.createNode.id;

        // mutation to create relationship to the node that was just created
        const {
          mutate: createRelationship,
          onDone: onCreateRelationshipDone,
          onError: onCreateRelationshipError,
        } = useMutation(gql`
          mutation (
            $name: String!
            $properties: JSONObject!
            $source: String!
            $target: String!
          ) {
            createRelationship(
              createRelationshipInput: {
                name: $name
                properties: $properties
                source: $source
                target: $target
              }
            ) {
              id
              name
              properties
              source {
                id
              }
              target {
                id
              }
            }
          }
        `);

        createRelationship({
          // data passed to the mutation
          name: relName,
          properties: relProperties,
          source: relSource,
          target,
        });

        onCreateRelationshipDone((relationshipResult) => {
          // runs if the mutation executed correctly
          // hide menu
          this.$el.classList.remove("show");
          this.$el.style.display = "none";

          // reset data
          this.labels = [""];
          this.nodeProperties = { "": "" };
          this.relationProperties = { "": "" };
          this.relationshipName = "";
          this.activeElementId = "";
          this.targetElementId = "";

          // emit event to parent component and return the data from the two mutations
          this.$emit("createRelationshiptoNewNode", {
            node: nodeResult.data.createNode,
            relationship: relationshipResult.data.createRelationship,
          });
        });

        onCreateRelationshipError((result) => {
          // runs if the create relation mutation runs into an error
          console.log(result.graphQLErrors[0].extensions?.response.message);
          alert(result.graphQLErrors[0].extensions?.response.message);
        });
      });

      onCreateNodeError((result) => {
        // runs if the create node mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
