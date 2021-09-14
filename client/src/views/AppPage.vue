<template>
  <div>
    <svg @contextmenu="rightClick($event)"></svg>

    <AddNode @addedNode="getAllUsers" />
    <EditNode
      :labelsProps="labels"
      :propertiesProps="properties"
      :nodeId="activeElementId"
      @editedNode="getAllUsers"
    />
    <EditRelationship
      :propertiesProps="properties"
      :nodeId="activeElementId"
      :relName="relationshipName"
      @editedRelationship="getAllUsers"
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
import EditRelationship from "../components/EditRelationship.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "AppPage",
  created() {
    this.getAllUsers();
  },
  data() {
    return {
      activeElementId: "",
      labels: [],
      properties: {},
      relationshipName: "",
    };
  },
  components: {
    ContextMenu,
    AddNode,
    EditNode,
    EditRelationship,
  },
  methods: {
    addNode() {
      this.hideAllInputMenus();
      document.getElementById("addNode")!.classList.add("show");
      document.getElementById("addNode")!.style.display = "block";
    },
    editNode() {
      this.hideAllInputMenus();

      var id = this.activeElementId;

      const { onResult, onError } = useQuery(
        gql`
          query ($id: String!) {
            node(id: $id) {
              labels
              properties
            }
          }
        `,
        { id }
      );

      onResult((result) => {
        this.labels = result.data.node.labels;
        this.properties = result.data.node.properties;

        document.getElementById("editNode")!.classList.add("show");
        document.getElementById("editNode")!.style.display = "block";
      });

      onError((result) => {
        console.log(result.graphQLErrors[0].extensions?.response.message);
        alert(result.graphQLErrors[0].extensions?.response.message);
      });
    },
    createRelToExistingNode() {
      const svg = document.querySelector("svg")!;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      line.setAttribute("stroke", "#999");
      line.setAttribute("stroke-opacity", "0.6");

      text.textContent = "";

      const activeElement = document.getElementById(
        this.activeElementId
      ) as unknown as SVGCircleElement;

      line.setAttribute("x1", activeElement.cx.baseVal.value.toString());
      line.setAttribute("y1", activeElement.cy.baseVal.value.toString());

      const mousemove = ({ x, y }: MouseEvent) => {
        svg.addEventListener("click", click);

        {
          const navBar = document.getElementById("nav")!;

          line.setAttribute("x2", x.toString());
          line.setAttribute("y2", (y - navBar.clientHeight).toString());
        }
      };

      const click = ({ target }: MouseEvent) => {
        svg.removeEventListener("mousemove", mousemove);
        svg.removeEventListener("click", click);

        const targetElement = target as SVGElement;

        if (targetElement instanceof SVGCircleElement) {
          console.log(targetElement.id);

          // TODO: Show dialog with relationship's name and props fields

          // TODO: Create relationship
        }

        line.remove();
        text.remove();
      };

      svg.addEventListener("mousemove", mousemove);

      svg.appendChild(line);
      svg.appendChild(text);

      return;
    },
    createRelToNewNode() {
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

      mutate({ id: id });

      onDone((result) => {
        this.getAllUsers();
      });

      onError((result) => {
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
          }
        }
      `);

      mutate({ id: id });

      onDone((result) => {
        this.properties = result.data.relationship.properties; // delete all old values first
        this.relationshipName = result.data.relationship.properties.name
        delete (this.properties as any)["name"]

        document.getElementById("editRelationship")!.classList.add("show");
        document.getElementById("editRelationship")!.style.display = "block";
      });

      onError((result) => {
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
        this.getAllUsers();
      });

      onError((result) => {
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
      const { onResult, onError } = useQuery(gql`
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

      const { nodes, relationships } = await new Promise((resolve, reject) => {
        onResult((result) => {
          resolve(JSON.parse(JSON.stringify(result.data))); // Fix: object is not extensible
        });

        onError((result) => {
          reject(result.graphQLErrors[0].extensions?.response.message);
          console.log(result.graphQLErrors[0].extensions?.response.message);
          alert(result.graphQLErrors[0].extensions?.response.message);
        });
      });

      const links = relationships.map((relationship: any) => {
        return {
          id: relationship.id,
          name: relationship.name,
          source: nodes.find((node: any) => node.id === relationship.source.id),
          target: nodes.find((node: any) => node.id === relationship.target.id),
        };
      });

      const svg = document.querySelector("svg") as SVGElement;
      svg.innerHTML = "";
      svg.setAttribute("viewBox", `0 0 ${svg.clientWidth} ${svg.clientHeight}`);

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .distance(200)
            .id((data: any) => data.id)
        )
        .force("charge", d3.forceManyBody())
        .force(
          "center",
          d3.forceCenter(svg.clientWidth / 2, svg.clientHeight / 2)
        )
        .on("tick", () => {
          linksSelection
            .attr("x1", (data: any) => data.source.x)
            .attr("y1", (data: any) => data.source.y)
            .attr("x2", (data: any) => data.target.x)
            .attr("y2", (data: any) => data.target.y);

          nodesSelection
            .attr("cx", (data: any) => data.x)
            .attr("cy", (data: any) => data.y);

          document.querySelectorAll("circle").forEach((circle) => {
            const text = circle.nextElementSibling!;

            text.setAttribute("x", circle.getAttribute("cx")!);
            text.setAttribute("y", circle.getAttribute("cy")!);
          });

          document.querySelectorAll("line").forEach((line) => {
            const text = line.nextElementSibling!;
            text.setAttribute(
              "x",
              (
                (line.x2.baseVal.value - line.x1.baseVal.value) / 2 +
                line.x1.baseVal.value
              ).toString()
            );
            text.setAttribute(
              "y",
              (
                (line.y2.baseVal.value - line.y1.baseVal.value) / 2 +
                line.y1.baseVal.value
              ).toString()
            );
          });
        });

      const linksSelection = d3
        .select("svg")
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("marker-end", "url(#arrowhead)")
        .attr("id", (data: any) => data.id);

      const arrowHeads = d3
        .select("svg")
        .append("g")
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
        .attr("style", "fill: #f00;");

      const nodesSelection = d3
        .select("svg")
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 40)
        .attr("fill", (data: any) => stringToColor(data.labels[0]))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .attr("id", (data: any) => data.id);

      nodesSelection
        .append("title")
        .text((data: any) => data.properties.name ?? data.labels[0]);
      linksSelection.append("title").text((data: any) => data.name);

      nodesSelection.call(drag(simulation));

      function drag(simulation: any): any {
        document.querySelectorAll("circle").forEach((circle) => {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );

          text.setAttribute("fill", "#ffffff");
          text.setAttribute("font-size", "14px");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("pointer-events", "none");
          text.setAttribute("alignment-baseline", "middle");
          text.setAttribute("style", "user-select: none;");

          text.textContent = circle.querySelector("title")!.textContent!;

          circle.insertAdjacentElement("afterend", text);
        });
        document.querySelectorAll("line").forEach((line: any) => {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );

          text.setAttribute("fill", "black");
          text.setAttribute("font-size", "10px");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("alignment-baseline", "middle");
          text.setAttribute("style", "user-select: none;");
          text.setAttribute("id", line.id);
          text.setAttribute(
            "x",
            (
              (line.x2.baseVal.value - line.x1.baseVal.value) / 2 +
              line.x1.baseVal.value
            ).toString()
          );
          text.setAttribute(
            "y",
            (
              (line.y2.baseVal.value - line.y1.baseVal.value) / 2 +
              line.y1.baseVal.value
            ).toString()
          );

          text.textContent = line.querySelector("title").textContent;

          line.insertAdjacentElement("afterend", text);
        });

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
      }
    },
  },
});
</script>
