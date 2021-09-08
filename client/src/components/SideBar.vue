<template>
    <div>
        <nav id="addNode" class="dropdown-menu dropdown-menu-sm show"

        >
            <form action="">
                <div class="sidebar-header">
                    <h3 id="addNodeHeader">Add a Node</h3>
                </div>
                <ul class="list-unstyled components p-3 pb-0">
                    <!-- <p>Add Node</p> -->
                    <label for="node-labels" class="mb-1">Node Labels</label>
                    <input type="text" class="form form-control ml-2 mr-2 mb-3" name="node-labels"
                        placeholder='divide labels with a ","'>
                    <label for="attributes" class="mb-1">Node Attributes</label>
                    <div name="attributes">
                        <div class="row mb-1">
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="attribute1">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="value1">
                            </div>
                        </div>
                        <div class="row mb-1">
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="attribute2">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="value2">
                            </div>
                        </div>
                        <div class="row mb-1">
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="attribute3">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control" placeholder="value3">
                            </div>
                        </div>
                    </div>
                    <input type="submit" class="form form-control btn btn-primary mt-3" value="Add Node">
                </ul>
            </form>
        </nav>
    </div>
</template>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

#addNode {
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

#sidebar h3{
    color: white
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #3472cf;
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

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #3472cf;
}
ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #3472cf;
}
.col-6:first-of-type{
    padding-right: 1%;
}
.col-6:nth-child(2){
    padding-left: 1%
}


#mydiv {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  text-align: center;
  border: 1px solid #d3d3d3;
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: "SideBarComp",
    data(){
        return {
            startingPos: {x: null, y: null},
            currentPos: {x: null, y: null},
            isMouseDown: false
        }
    },
    mounted () {
        this.dragElement(document.getElementById("addNode"));
    },
    methods: {
        dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById("addNodeHeader")) {
                // if present, the header is where you move the DIV from:
                document.getElementById("addNodeHeader").onmousedown = dragMouseDown;
            } else {
                // otherwise, move the DIV from anywhere inside the DIV:
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (pos4) + "px";
                elmnt.style.left = (pos3) + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
})


</script>
