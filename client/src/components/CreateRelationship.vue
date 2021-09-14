<template>
  <nav id="createRelationship" class="dropdown-menu dropdown-menu-sm inputMenu">
    <div>
      <MenuHeader :menuName="'Create Relationship'" />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
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
          :attr="properties"
          @attributesChanged="changeProperties($event)"
        />
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="createRelationship"
        >
          Create Relationship
        </button>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
#createRelationship {
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
import MenuHeader from "./MenuHeader.vue";
import Attributes from "./Attributes.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "CreateRelationship",
  components: {
    MenuHeader,
    Attributes,
  },
  data() {
    return {
      properties: { "": "" },
      toggleMenu: true,
      relationshipName: "",
      activeElementId: "",
      targetElementId: "",
    };
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
    changeProperties(event: any) {
      this.properties = event;
    },
    changeName(event: any) {
      this.relationshipName = event.path[0].value.toUpperCase();
    },
    createRelationship() {
      var properties = Object.entries(this.properties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      const { mutate, onDone, onError } = useMutation(gql`
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

      mutate({
        name: this.relationshipName,
        properties: properties,
        source: this.activeElementId,
        target: this.targetElementId,
      });

      onDone((result) => {
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        this.properties = { "": "" };
        this.relationshipName = "";
        this.$emit("createRelationship");
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
