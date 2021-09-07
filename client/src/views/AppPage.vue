<template>
  <svg></svg>
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
  methods: {
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
        });
      const linksSelection = d3
        .select("svg")
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

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

          text.textContent = circle.querySelector("title")!.textContent!;

          circle.insertAdjacentElement("afterend", text);
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
          text.textContent = circle.querySelector("title")!.textContent!;

          circle.insertAdjacentElement("afterend", text);
        });

        return drag(simulation);
      }

      function drag(simulation: any) {
        function dragstarted(event: any) {
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
