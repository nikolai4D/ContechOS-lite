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
    return {
      isMouseDown: false,
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
    Attributes,
    Labels,
    MenuHeader,
  },
  props: {
    activeElmntId: String,
    targetElmntId: String,
  },
  watch: {
    activeElmntId(newValue, oldValue) {
      this.activeElementId = newValue;
    },
    targetElmntId(newValue, oldValue) {
      this.targetElementId = newValue;
    },
  },
  methods: {
    changeAttributes(event: any) {
      this.nodeProperties = { ...this.nodeProperties, ...event };
    },
    changeLabels(event: any) {
      this.labels = event;
    },
    changeProperties(event: any) {
      this.relationProperties = { ...this.relationProperties, ...event };
    },
    changeName(event: any) {
      this.relationshipName = event.path[0].value.toUpperCase();
    },
    addNodeAndRel() {
      var nodeLabels = this.labels;
      var nodeProperties = Object.entries(this.nodeProperties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var relName = this.relationshipName;
      var relProperties = Object.entries(this.relationProperties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var relSource = this.activeElementId;

      const { mutate: createNode, onDone: onCreateNodeDone, onError: onCreateNodeError } = useMutation(gql`
        mutation (
          $labels: [String!]!
          $properties: JSONObject!
        ) {
          createNode(
            createNodeInput: {
              labels: $labels
              properties: $properties
            }
          ) {
            id
          }
        }
      `);
      
      console.log(nodeLabels);

      createNode({
        labels: nodeLabels,
        properties: nodeProperties,
      });

      onCreateNodeDone((result) => {
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        this.$emit("createRelationshiptoNewNode");

        const target = result.data.createNode.id;

        const { mutate: createRelationship, onDone: onCreateRelationshipDone, onError: onCreateRelationshipError } = useMutation(gql`
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
              properties
            }
          }
        `);

        createRelationship({
          name: relName,
          properties: relProperties,
          source: relSource,
          target,
        });

        onCreateRelationshipDone((result) => {
          this.$el.classList.remove("show");
          this.$el.style.display = "none";
          this.$emit("createRelationshiptoNewNode");

          this.labels = [""];
          this.nodeProperties = { "": "" };
          this.relationProperties = { "": "" };
          this.relationshipName = "";
          this.activeElementId = "";
          this.targetElementId = "";
        });

        onCreateRelationshipError((result) => {
          console.log(result.graphQLErrors[0].extensions?.response.message);
          alert(result.graphQLErrors[0].extensions?.response.message);
        });
      });

      onCreateNodeError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
