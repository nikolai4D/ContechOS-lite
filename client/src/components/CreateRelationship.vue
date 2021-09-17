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

  &.show { // this activates when this element has the class show
    display: block;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import MenuHeader from "./MenuHeader.vue";
import Attributes from "./Attributes.vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "CreateRelationship",
  components: { // child components used
    MenuHeader,
    Attributes,
  },
  data() { // variables used in this component
    return {
      properties: { "": "" },
      toggleMenu: true,
      relationshipName: "",
      activeElementId: "",
      targetElementId: "",
    };
  },
  props: { // data given on creation of component from parent component
    activeElmntId: String,
    targetElmntId: String,
  },
  watch: { // executes when the value of the given prop changes on the parent element
    activeElmntId(newValue, oldValue) {
      this.activeElementId = newValue;
    },
    targetElmntId(newValue, oldValue) {
      this.targetElementId = newValue;
    },
  },
  methods: { // methods used in this component
    changeProperties(event: any) {
      this.properties = event;
    },
    changeName(event: any) {
      this.relationshipName = event.path[0].value.toUpperCase();
    },
    createRelationship() { // function that manages the mutation used to create a relationship
      // remove blank properties, which are the ones that are "": ""
      var properties = Object.entries(this.properties) 
        .filter(([key]) => key !== "")
        .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});

      //mutation
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

      mutate({ // data passed to the mutation
        name: this.relationshipName,
        properties: properties,
        source: this.activeElementId,
        target: this.targetElementId,
      });

      
     onDone((result) => { // runs if the mutation executed correctly
        // hide menu
        this.$el.classList.remove("show");
        this.$el.style.display = "none";
        //reset data
        this.properties = { "": "" };
        this.relationshipName = "";

        //emit event to parent component and return the data from the mutation
        this.$emit("createRelationship", result.data.createRelationship);
      });

      onError((result) => { // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
  },
});
</script>
