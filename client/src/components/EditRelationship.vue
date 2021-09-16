<template>
  <nav id="editRelationship" class="dropdown-menu dropdown-menu-sm inputMenu">
    <div>
      <MenuHeader
        :menuName="'Edit Relationship'"
        @menuToggle="toggleMenu = $event"
      />
      <ul class="list-unstyled components p-3 pb-0" v-if="toggleMenu">
        <div class="mb-3">
          <label for="rel-name" class="mb-1">Relationship Name</label>
          <input
            type="text"
            placeholder="relationship name"
            class="form-control"
            :value="relationshipName"
            disabled
          />
        </div>
        <Attributes
          :attr="properties"
          @attributesChanged="changeProperties($event)"
        />
        <button
          type="submit"
          class="form form-control btn btn-primary mt-3"
          @click="editRelationship"
        >
          Edit Relationship
        </button>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
#editRelationship {
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
import MenuHeader from "./MenuHeader.vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "EditRelationship",
  data() {
    return {
      properties: {},
      activeRelationshipId: "",
      toggleMenu: true,
      relationshipName: "",
    };
  },
  props: {
    nodeId: String,
    propertiesProps: {},
    relName: String,
  },
  watch: {
    propertiesProps(newValue, oldValue) {
      var cleanProperties = this.removeUnnecessaryProperties(newValue);
      this.properties = cleanProperties;
    },
    nodeId(newValue, oldValue) {
      this.activeRelationshipId = newValue;
    },
    relName(newValue, oldValue) {
      this.relationshipName = newValue;
    },
  },
  components: {
    Attributes,
    MenuHeader,
  },
  methods: {
    changeProperties(event: any) {
      this.properties = event;
    },
    removeUnnecessaryProperties(properties: any) {
      return Object.entries(properties)
        .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
    },
    editRelationship() {
      var properties = this.properties;
      properties = Object.entries(properties)
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
      var id = this.activeRelationshipId;

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($properties: JSONObject, $id: String!) {
          updateRelationship(
            updateRelationshipInput: { properties: $properties }
            id: $id
          ) {
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

      mutate({ properties: properties, id: id });

      onDone((result) => {
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        this.$emit("editedRelationship", {
          id,
          ...result.data.updateRelationship,
        });
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
