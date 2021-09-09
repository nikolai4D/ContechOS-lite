<template>
    <div name="attributes">
        <label for="attributes" class="mb-1">Node Attributes</label>
        <div class="row mb-1 attribute" v-for="(attribute, id) in attributes" :key="id">
            <div class="col-5">
            <input
                type="text"
                class="form-control"
                placeholder="attribute"
                :value="attribute.name"
            />
            </div>
            <div class="col-6">
            <input
                type="text"
                class="form-control"
                placeholder="value"
                name="attribute"
                :value="attribute.value"
            />
            </div>
            <div class="col-1">
            <i class="fa fa-trash" @click="removeAttribute(attribute)"></i>
            </div>
        </div>

        <div @click="addAttribute">
            <i class="fas fa-plus"></i>
            <label for="addAttribute">Add Attribute</label>
        </div>
    </div>

    <div @click="addAttribute">
      <i class="fas fa-plus"></i>
      <label for="addAttribute">Add Attribute</label>
    </div>
  </div>
</template>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

i.fa-trash{
  padding-top: 10px;
}

.row {
  --bs-gutter-x: 0;
}

.col-6:first-of-type {
  padding-right: 1%;
}

.col-6:nth-child(2) {
  padding-left: 1%;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "Attributes",
    data() {
      return{
        attributes:[]
      }
    },
    props: {
      attr:Array
    },
    mounted() {
      this.attributes = this.attr
    },
    methods: {
        addAttribute() {
          this.attributes.push({name: "", value: ""})
        },
        removeAttribute(attr) {
          console.log("a")
          var index = this.attributes.indexOf(attr);
          if (index !== -1) {
              this.attributes.splice(index, 1);
          }
        },
    }
})
</script>
