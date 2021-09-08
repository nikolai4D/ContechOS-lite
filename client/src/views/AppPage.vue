<template>
  <div>
    <svg @contextmenu="rightClick($event)"></svg>

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

    <SideBarComp />
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
import { uniqBy } from "lodash";
import * as d3 from "d3";
import ContextMenu from "../components/ContextMenu.vue";
import SideBarComp from "../components/SideBar.vue";

export default defineComponent({
  name: "AppPage",
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.getAllUsers();
  },
  components: {
    ContextMenu,
    SideBarComp
  },
  methods: {
    addNode() {
      console.log("adding a node");
      document.getElementById("addNode")!.classList.add("show")
      document.getElementById("addNode")!.style.display = "block";
    },
    editNode() {
      console.log("editNode");
    },
    createRelToExistingNode() {
      console.log("createRelToExistingNode");
    },
    createRelToNewNode() {
      console.log("createRelToNewNode");
    },
    deleteNode() {
      console.log("deleteNode");
    },
    editRel() {
      console.log("editRel");
    },
    deleteRel() {
      console.log("deleteRel");
    },
    hideAllMenus() {
      document.querySelectorAll<HTMLElement>(".dropdown-menu").forEach((el) => {
        el.classList.remove("show");
        el.style.display = "none";
      });
    },
    rightClick(e: any) {
      e.preventDefault();

      // first let's remove all opened menus
      this.hideAllMenus();

      // select menu to display  based on where you clicked
      var clickedOn = e.path[0]; // get the element you directly clicked on
      var contMenu: any = null;
      if (clickedOn.tagName == "circle") {
        // if you click on a node
        console.log(
          "right clicked on a node of class " + clickedOn.className.baseVal
        );
        contMenu = document.getElementById("node-context-menu")!;
      } else if (clickedOn.tagName == "line" || clickedOn.tagName == "text") {
        // if you click on a relationship
        console.log("right clicked on a relationship");
        contMenu = document.getElementById("rel-context-menu")!;
      } else if (clickedOn.tagName == "svg") {
        // if you clicked on the background
        console.log("right clicked on the background");
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
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth.token")}`,
        },
        body: JSON.stringify({
          operationName: null,
          variables: {},
          query:
            "{\n  users {\n    id\n    name\n    email\n    role {\n    id\n    }  }\n}\n",
        }),
      });

      const { users } = (await response.json()).data;

      const roles = uniqBy(
        users.map((user: any) => user.role),
        "id"
      );

      const links = users.map((user: any) => {
        return {
          source: user,
          target: roles.find((role: any) => role.id === user.role.id),
          name: "has role",
        };
      });

      this.users = users;

      const svg = document.querySelector("svg") as SVGElement;
      svg.setAttribute("viewBox", `0 0 ${svg.clientWidth} ${svg.clientHeight}`);

      const simulation = d3
        .forceSimulation([...users, ...roles])
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

          // linksArrow
          //   .attr("refX", (data: any) => data.target.x)
          //   .attr("refY", (data: any) => data.target.y);

          userNodesSelection
            .attr("cx", (data: any) => data.x)
            .attr("cy", (data: any) => data.y);

          roleNodesSelection
            .attr("cx", (data: any) => data.x)
            .attr("cy", (data: any) => data.y);

          document.querySelectorAll("circle").forEach((circle) => {
            const text = circle.nextElementSibling!;

            text.setAttribute("x", circle.getAttribute("cx")!);
            text.setAttribute("y", circle.getAttribute("cy")!);
          });

          document.querySelectorAll("line").forEach((line) => {
            const text = line.nextElementSibling!;
            text.setAttribute("x", ((line.x2.baseVal.value - line.x1.baseVal.value) /2 + line.x1.baseVal.value).toString());
            text.setAttribute("y", ((line.y2.baseVal.value - line.y1.baseVal.value) /2 + line.y1.baseVal.value).toString());
          });
        });


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
        .attr("style", "fill: #f00;")
        
      const linksSelection = d3
        .select("svg")
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("marker-end", "url(#arrowhead)");

    //     <marker
        //   id="arrow"
        //   markerUnits="strokeWidth"
        //   markerWidth="12"
        //   markerHeight="12"
        //   viewBox="0 0 12 12"
        //   refX="6"
        //   refY="6"
        //   orient="auto">
        //   <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #f00;"></path>
        // </marker>

      const userNodesSelection = d3
        .select("svg")
        .append("g")
        .selectAll("circle")
        .data(users)
        .join("circle")
        .attr("r", 40)
        .attr("fill", "#3c3c3c")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .classed("user", true);

      const roleNodesSelection = d3
        .select("svg")
        .append("g")
        .selectAll("circle")
        .data(roles)
        .join("circle")
        .attr("r", 40)
        .attr("fill", "#f02e51")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .classed("role", true);

      userNodesSelection.append("title").text((data: any) => data.name);
      roleNodesSelection.append("title").text((data: any) => data.id);
      linksSelection.append("title").text((data: any) => data.name);
      userNodesSelection.call(dragUsers(simulation));

      function dragUsers(simulation: any): any {
        document.querySelectorAll("circle.user").forEach((circle) => {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );

          text.setAttribute("fill", "#ffffff");
          text.setAttribute("font-size", "14px");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("pointer-events", "none");
          text.setAttribute("alignment-baseline", "middle");
          text.setAttribute("style", "text-transform: capitalize");

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
          text.setAttribute("pointer-events", "none");
          text.setAttribute("alignment-baseline", "middle");
          text.setAttribute("x", ((line.x2.baseVal.value - line.x1.baseVal.value) /2 + line.x1.baseVal.value).toString());
          text.setAttribute("y", ((line.y2.baseVal.value - line.y1.baseVal.value) /2 + line.y1.baseVal.value).toString());
          
          text.textContent = "has role";

          line.insertAdjacentElement("afterend", text);
        });

        return drag(simulation);
      }

      roleNodesSelection.call(dragRoles(simulation));

      function dragRoles(simulation: any): any {
        document.querySelectorAll("circle.role").forEach((circle) => {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );

          text.setAttribute("fill", "#ffffff");
          text.setAttribute("font-size", "14px");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("alignment-baseline", "middle");
          text.setAttribute("pointer-events", "none");
          text.setAttribute("style", "text-transform: capitalize");
          text.textContent = circle.querySelector("title")!.textContent!;

          circle.insertAdjacentElement("afterend", text);
        });

        return drag(simulation);
      }

      function drag(simulation: any) {
        function dragstarted(event: any) {
          // first hide all open menus
          document
            .querySelectorAll<HTMLElement>(".dropdown-menu")
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
