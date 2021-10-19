<template>
  <div>
    <svg @contextmenu="rightClick($event)"></svg>

    <RelationshipToNewNode
      :activeElmntId="activeElementId"
      :targetElmntId="targetElementId"
      @createRelationshiptoNewNode="handleCreateRelationshipToNewNode"
    />

    <AddNode @addedNode="handleAddedNode" />
    <EditNode
      :labelsProps="labels"
      :propertiesProps="properties"
      :nodeId="activeElementId"
      @editedNode="handleEditedNode"
    />
    <EditRelationship
      :propertiesProps="properties"
      :nodeId="activeElementId"
      :relName="relationshipName"
      @editedRelationship="handleEditedRelationship"
    />
    <CreateRelationship
      :activeElmntId="activeElementId"
      :targetElmntId="targetElementId"
      @createRelationship="handleCreateRelationship"
    />

    <ContextMenu
      :menuId="'bg-context-menu'"
      :options="[{ name: 'Add Node', action: addNode }]"
    />
    <ContextMenu
      :menuId="'node-context-menu'"
      :options="[
        { name: 'Edit Node', action: editNode },
        {
          name: 'Create Relation to Existing Node',
          action: createRelToExistingNode,
        },
        { name: 'Create Relation to New Node', action: createRelToNewNode },
        { name: 'Delete Node', action: deleteNode },
      ]"
    />
    <ContextMenu
      :menuId="'rel-context-menu'"
      :options="[
        { name: 'Edit Relation', action: editRel },
        { name: 'Delete Relation', action: deleteRel },
      ]"
    />
  </div>
</template>

<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import * as d3 from "d3";
import stringToColor from "string-to-color";
import ContextMenu from "../components/ContextMenu.vue";
import AddNode from "../components/AddNode.vue";
import EditNode from "../components/EditNode.vue";
import CreateRelationship from "../components/CreateRelationship.vue";
import RelationshipToNewNode from "../components/CreateRelToNewNode.vue";
import EditRelationship from "../components/EditRelationship.vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "AppPage",
  created() {
    this.getAllUsers();
  },
  data() {
    // variables used in this component
    return {
      activeElementId: "",
      labels: [],
      properties: {},
      relationshipName: "",
      targetElementId: "",
      simulation: null,
      nodesSelection: null,
      nodeLabelsSelection: null,
      linksSelection: null,
      linkLabelsSelection: null,
      arrowsSelection: null,
      nodes: [],
      relationships: [],
      selectionsInitialized: false,
    } as {
      activeElementId: string;
      labels: string[];
      properties: any;
      relationshipName: string;
      targetElementId: string;
      simulation: any;
      nodesSelection: any;
      nodeLabelsSelection: any;
      linksSelection: any;
      linkLabelsSelection: any;
      arrowsSelection: any;
      nodes: any[];
      relationships: any[];
      selectionsInitialized: boolean;
    };
  },
  mounted() {
    let navHeight = document.getElementById("nav")!.offsetHeight;
    let docHeight = window.innerHeight;
    document.getElementsByTagName("svg")![0].style.height =
      docHeight - navHeight + "px";
    // Snippet from elsewhere. need more information how d3 works
    //https://bl.ocks.org/sistemawebpro/41d81ad70d7355691a61a6f7ac7f83d9
    //https://stackoverflow.com/questions/66900901/how-to-set-up-d3-zoom-correctly-in-vue

/*    var svg = d3.select("#dataviz_basicZoom")
        .append("svg")
        .call(d3.zoom().on("zoom", function () {
          svg.attr("transform", d3.event.transform)
        }))
        .append("g")*/

  },
  components: {
    // child components used
    ContextMenu,
    AddNode,
    EditNode,
    EditRelationship,
    CreateRelationship,
    RelationshipToNewNode,
  },
  methods: {
    // methods used in this component
    addNode() {
      this.hideAllInputMenus();
      document.getElementById("addNode")!.classList.add("show");
      document.getElementById("addNode")!.style.display = "block";
    },
    editNode() {
      this.hideAllInputMenus();

      var id = this.activeElementId;

      const { mutate, onDone, onError } = useMutation(gql`
        query ($id: String!) {
          node(id: $id) {
            labels
            properties
          }
        }
      `);

      mutate({ id });

      onDone((result) => {
        // runs if the mutation executed correctly
        this.labels = result.data.node.labels;
        this.properties = result.data.node.properties;

        document.getElementById("editNode")!.classList.add("show");
        document.getElementById("editNode")!.style.display = "block";
      });

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
    createRelToExistingNode(event: any) {
      const svg = document.querySelector("svg")!;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      line.setAttribute("stroke", "#999");
      line.setAttribute("stroke-opacity", "0.6");
      line.setAttribute("marker-end", "url(#arrowhead)");

      arrow.setAttribute("id", "arrowhead");
      arrow.setAttribute("markerUnits", "strokeWidth");
      arrow.setAttribute("markerWidth", "12");
      arrow.setAttribute("markerHeight", "12");
      arrow.setAttribute("viewBox", "0 0 12 12");
      arrow.setAttribute("refX", "6");
      arrow.setAttribute("refY", "6");
      arrow.setAttribute("orient", "auto");
      arrow.appendChild(path);

      text.textContent = "";

      const activeElement = document.getElementById(
        this.activeElementId
      ) as unknown as SVGCircleElement;

      const navBar = document.getElementById("nav")!;

      line.setAttribute("x1", activeElement.cx.baseVal.value.toString());
      line.setAttribute("y1", activeElement.cy.baseVal.value.toString());
      line.setAttribute("x2", event.clientX);
      line.setAttribute("y2", (event.clientY - navBar.clientHeight).toString());

      const mousemove = ({ x, y }: MouseEvent) => {
        svg.addEventListener("click", click);

        {
          line.setAttribute("x2", x.toString());
          line.setAttribute("y2", (y - navBar.clientHeight).toString());
        }
      };

      const click = ({ target }: MouseEvent) => {
        svg.removeEventListener("mousemove", mousemove);
        svg.removeEventListener("click", click);

        const targetElement = target as SVGElement;

        if (targetElement instanceof SVGCircleElement) {
          this.targetElementId = targetElement.id;

          document.getElementById("createRelationship")!.classList.add("show");
          document.getElementById("createRelationship")!.style.display =
            "block";
        }

        line.remove();
        text.remove();
        arrow.remove();
        path.remove();
      };

      svg.addEventListener("mousemove", mousemove);

      svg.appendChild(line);
      svg.appendChild(text);

      return;
    },
    createRelToNewNode() {
      document.getElementById("createRelToNewNode")!.classList.add("show");
      document.getElementById("createRelToNewNode")!.style.display = "block";
      return;
    },
    deleteNode() {
      var id = this.activeElementId;

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($id: String!) {
          removeNode(id: $id) {
            success
          }
        }
      `);

      mutate({ id });

      onDone((result) => {
        // runs if the mutation executed correctly
        if (result.data.removeNode.success) {
          this.nodes = this.nodes.filter((node: any) => node.id !== id);
          this.restart();
        } else {
          console.log(
            "Couldn't delete the node, because it has outstanding relationships"
          );
          alert(
            "Couldn't delete the node, because it has outstanding relationships"
          );
        }
      });

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
    editRel() {
      var id = this.activeElementId;

      const { mutate, onDone, onError } = useMutation(gql`
        query ($id: String!) {
          relationship(id: $id) {
            properties
            name
          }
        }
      `);

      mutate({ id: id });

      onDone((result) => {
        // runs if the mutation executed correctly
        this.properties = result.data.relationship.properties;
        this.relationshipName = result.data.relationship.name;

        document.getElementById("editRelationship")!.classList.add("show");
        document.getElementById("editRelationship")!.style.display = "block";
      });

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
    deleteRel() {
      const id = this.activeElementId;

      const { mutate, onDone, onError } = useMutation(gql`
        mutation ($id: String!) {
          removeRelationship(id: $id) {
            success
          }
        }
      `);

      mutate({ id });

      onDone((result) => {
        // runs if the mutation executed correctly
        if (result.data.removeRelationship.success) {
          this.relationships = this.relationships.filter(
            (relationship) => relationship.id !== id
          );
          this.restart();
        } else {
          console.log("Couldn't delete the relationship");
          alert("Couldn't delete the relationship");
        }
      });

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
    hideAllContextMenus() {
      document.querySelectorAll<HTMLElement>(".context-menu").forEach((el) => {
        el.classList.remove("show");
        el.style.display = "none";
      });
    },
    hideAllInputMenus() {
      document.querySelectorAll<HTMLElement>(".inputMenu").forEach((el) => {
        el.classList.remove("show");
        el.style.display = "none";
      });
    },
    rightClick(e: any) {
      e.preventDefault();

      // first let's remove all opened menus
      this.hideAllContextMenus();

      // select menu to display  based on where you clicked
      var clickedOn = e.path[0]; // get the element you directly clicked on
      var contMenu: any = null;
      if (clickedOn.tagName == "circle") {
        // if you click on a node
        this.activeElementId = clickedOn.id;
        contMenu = document.getElementById("node-context-menu")!;
      } else if (clickedOn.tagName == "line" || clickedOn.tagName == "text") {
        // if you click on a relationship
        this.activeElementId = clickedOn.id;
        contMenu = document.getElementById("rel-context-menu")!;
      } else if (clickedOn.tagName == "svg") {
        // if you clicked on the background
        contMenu = document.getElementById("bg-context-menu")!;
      }

      // display menu
      contMenu.classList.add("show");
      contMenu.style.top = e.y + "px";
      contMenu.style.left = e.x + "px";
      contMenu.style.display = "block";

      document.addEventListener("click", () => {
        // hide after left click on svg
        contMenu.classList.remove("show");
        contMenu.style.display = "none";
      });
    },
    async getAllUsers() {
      // Not a mutation but useMutation forces it to go to the server
      // and not to the cache, unlike useQuery.
      const { mutate, onDone, onError } = useMutation(gql`
        query {
          nodes {
            id
            labels
            properties
          }

          relationships(from: null, to: null) {
            id
            name
            source {
              id
            }
            target {
              id
            }
          }
        }
      `);

      mutate();

      onError((result) => {
        // runs if the mutation runs into an error
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });

      onDone((result) => {
        // runs if the mutation executed correctly
        this.nodes = result.data.nodes;
        this.relationships = result.data.relationships;

        this.init(result.data);
      });
    },
    async init({ nodes, relationships }: any) {

      const svg = document.querySelector("svg") as SVGElement;
      svg.setAttribute("viewBox", `0 0 ${svg.clientWidth} ${svg.clientHeight}`);


      let zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", function(event, a) {
        svg.setAttribute("transform", event.transform)
      })

      d3.select<SVGSVGElement, unknown>("svg").call(zoom)

      // Create a links object using the object structure that d3 expects.
      const links = relationships.map((relationship: any) => {
        return {
          id: relationship.id,
          name: relationship.name,
          source: nodes.find((node: any) => node.id === relationship.source.id),
          target: nodes.find((node: any) => node.id === relationship.target.id),
        };
      });

      // Create the D3 force simulation
      this.simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .distance(200)
            .id((data: any) => data.id)
        )
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide().radius(70).iterations(2))
        .force(
          "center",
          d3.forceCenter(svg.clientWidth / 2, svg.clientHeight / 2)
        )
        .on("tick", this.tick);

      this.linksSelection = d3
        .select("svg")
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .classed("links", true)
        .selectAll("line")
        .data(links, (link: any) => link.id)
        .join("line")
        .attr("marker-end", "url(#arrowhead)")
        .attr("id", (data: any) => data.id);

      this.linkLabelsSelection = d3
        .select("svg")
        .append("g")
        .classed("linkLabels", true)
        .selectAll("text")
        .data(links, (link: any) => link.id)
        .join("text")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("style", "user-select: none")
        .attr("id", (link: any) => link.id)
        .text((link: any) => link.name);

      this.arrowsSelection = d3
        .select("svg")
        .append("g")
        .classed("arrows", true)
        .selectAll("marker")
        .data(links)
        .join("marker")
        .attr("id", "arrowhead")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("viewBox", "0 0 12 12")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .attr("style", "fill: rgba(0,0,0,0.3);");

      this.nodesSelection = d3
        .select("svg")
        .append("g")
        .classed("nodes", true)
        .selectAll("circle")
        .data(this.nodes, (node: any) => node.id)
        .join("circle")
        .attr("r", 40)
        .attr("fill", (data: any) => stringToColor(data.labels[0]))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .attr("id", (data: any) => data.id);

      this.nodeLabelsSelection = d3
        .select("svg")
        .append("g")
        .classed("nodeLabels", true)
        .selectAll("text")
        .data(this.nodes, (node: any) => node.id)
        .join("text")
        .attr("fill", "#ffffff")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("alignment-baseline", "middle")
        .attr("style", "user-select: none;")
        .text((node: any) => node.properties.name ?? node.labels[0]);

      this.nodesSelection
        .append("title")
        .text((data: any) => data.properties.name ?? data.labels[0]);
      this.linksSelection.append("title").text((data: any) => data.name);

      this.nodesSelection.call(this.drag(this.simulation));
    },
    restart() {
      const links = this.relationships.map((relationship: any) => {
        return {
          id: relationship.id,
          name: relationship.name,
          source: this.nodes.find(
            (node: any) => node.id === relationship.source.id
          ),
          target: this.nodes.find(
            (node: any) => node.id === relationship.target.id
          ),
        };
      });

      this.simulation.nodes(this.nodes);

      this.nodesSelection
        .data(this.nodes, (node: any) => node.id)
        .exit()
        .remove();

      this.linksSelection
        .data(links, (link: any) => link.id)
        .exit()
        .remove();

      this.nodeLabelsSelection
        .data(this.nodes, (node: any) => node.id)
        .exit()
        .remove();

      this.linkLabelsSelection
        .data(links, (link: any) => link.id)
        .exit()
        .remove();

      this.linksSelection
        .data(links, (link: any) => link.id)
        .enter()
        .append("line")
        .attr("marker-end", "url(#arrowhead)")
        .attr("id", (data: any) => data.id)
        .append("title")
        .text((data: any) => data.name);

      this.linkLabelsSelection
        .data(links, (link: any) => link.id)
        .enter()
        .append("text")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("style", "user-select: none")
        .attr("id", (link: any) => link.id)
        .text((link: any) => link.name);

      this.arrowsSelection
        .selectAll("marker")
        .data(links)
        .join("marker")
        .attr("id", "arrowhead")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("viewBox", "0 0 12 12")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .attr("style", "fill: rgba(0,0,0,0.3);");

      this.nodesSelection
        .data(this.nodes, (node: any) => node.id)
        .enter()
        .append("circle")
        .attr("r", 40)
        .attr("fill", (data: any) => stringToColor(data.labels[0])) // Color the nodes based on the first label
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .attr("id", (data: any) => data.id)
        .append("title")
        .text((data: any) => data.properties.name ?? data.labels[0]);

      this.nodeLabelsSelection
        .data(this.nodes, (node: any) => node.id)
        .enter()
        .append("text")
        .attr("fill", "#ffffff")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("alignment-baseline", "middle")
        .attr("style", "user-select: none;")
        .text((node: any) => node.properties.name ?? node.labels[0]);

      // Update the simulation's links
      this.simulation.force(
        "link",
        d3
          .forceLink(links)
          .distance(200)
          .id((data: any) => data.id)
      );

      // Add drag to new nodes
      this.nodesSelection.call(this.drag(this.simulation));

      // Restart the simulation
      this.simulation.alpha(1).restart();
    },
    tick() {
      // Reset selections to update with new elements
      this.linksSelection = d3.select("svg").select(".links").selectAll("line");

      this.linkLabelsSelection = d3
        .select("svg")
        .select(".linkLabels")
        .selectAll("text");

      this.arrowsSelection = d3
        .select("svg")
        .select(".arrow")
        .selectAll("marker");

      this.nodesSelection = d3
        .select("svg")
        .select(".nodes")
        .selectAll("circle");

      this.nodeLabelsSelection = d3
        .select("svg")
        .select(".nodeLabels")
        .selectAll("text");

      // Add drag to new nodes in the selection
      this.nodesSelection.call(this.drag(this.simulation));

      // arrows management
      this.linksSelection
        .attr("x1", (data: any) => {
          let distanceX = data.target.x - data.source.x;
          let distanceY = data.target.y - data.source.y;
          let distanceBetweenCenters =
            Math.sqrt(distanceX * distanceX + distanceY * distanceY) - 15;
          let startingX =
            data.source.x + (40 / distanceBetweenCenters) * distanceX;
          let result = startingX;
          return result;
        })
        .attr("y1", (data: any) => {
          let distanceX = data.target.x - data.source.x;
          let distanceY = data.target.y - data.source.y;
          let distanceBetweenCenters =
            Math.sqrt(distanceX * distanceX + distanceY * distanceY) - 15;
          let startingY =
            data.source.y + (40 / distanceBetweenCenters) * distanceY;
          let result = startingY;
          return result;
        })
        .attr("x2", (data: any) => {
          let distanceX = data.target.x - data.source.x;
          let distanceY = data.target.y - data.source.y;
          let distanceBetweenCenters =
            Math.sqrt(distanceX * distanceX + distanceY * distanceY) - 30;
          let startingX =
            data.source.x + (40 / distanceBetweenCenters) * distanceX;
          let result = data.target.x - (startingX - data.source.x);
          return result;
        })
        .attr("y2", (data: any) => {
          let distanceX = data.target.x - data.source.x;
          let distanceY = data.target.y - data.source.y;
          let distanceBetweenCenters =
            Math.sqrt(distanceX * distanceX + distanceY * distanceY) - 30;
          let startingY =
            data.source.y + (40 / distanceBetweenCenters) * distanceY;
          let result = data.target.y - (startingY - data.source.y);
          return result;
        });

      // Update coordinates
      this.nodesSelection
        .attr("cx", (data: any) => data.x)
        .attr("cy", (data: any) => data.y);

      this.nodeLabelsSelection
        .attr("x", (data: any) => data.x)
        .attr("y", (data: any) => data.y);

      this.linkLabelsSelection
        .attr(
          "x",
          (data: any) => (data.target.x - data.source.x) / 2 + data.source.x
        )
        .attr(
          "y",
          (data: any) => (data.target.y - data.source.y) / 2 + data.source.y
        );
    },
    handleCreateRelationshipToNewNode({ node, relationship }: any) {
      this.nodes.push(node);
      this.relationships.push(relationship);

      this.restart();
    },
    handleAddedNode(node: any) {
      this.nodes.push(node);

      this.restart();
    },
    handleEditedNode(newNode: any) {
      this.nodes[this.nodes.findIndex((node: any) => node.id == newNode.id)] =
        newNode;

      this.restart();
    },
    handleEditedRelationship(newRelationship: any) {
      this.relationships[
        this.relationships.findIndex(
          (relationship: any) => relationship.id == newRelationship.id
        )
      ] = newRelationship;

      this.restart();
    },
    handleCreateRelationship(relationship: any) {
      this.relationships.push(relationship);

      this.restart();
    },
    drag(simulation: any): any {
      function dragstarted(event: any) {
        // first hide all open menus
        document
          .querySelectorAll<HTMLElement>(".context-menu")
          .forEach((el) => {
            el.classList.remove("show");
            el.style.display = "none";
          });

        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },
  },
});
</script>
