<template>
    <div name="attributes">
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


</template>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

i.fas {
  padding: 3%;
  font-size: 1.2em;
}
i.fa-trash{
  padding-top: 10px;
}

.row {
  --bs-gutter-x: 0;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

#editNode {
  /* don't forget to add all the previously mentioned styles here too */
  background: white;
  box-shadow: 0px 0px 15px black;
  transition: all 0.3s;
  width: 20%;
  display: block;
  position: absolute;
  top: 30%;
  right: 2%;
}

#sidebar h3 {
  color: white;
}

#sidebar ul.components {
  padding: 20px 0;
}

#sidebar ul p {
  color: black;
  padding: 10px;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}
#sidebar ul li a:hover {
  color: #3472cf;
  background: #fff;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #3472cf;
}
ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #3472cf;
}
.col-6:first-of-type {
  padding-right: 1%;
}
.col-6:nth-child(2) {
  padding-left: 1%;
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: "Attributes",
    data() {
        return{
            attributes: [{name:"name", value:"luke"}],
        }
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
