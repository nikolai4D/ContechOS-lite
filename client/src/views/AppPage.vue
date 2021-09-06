<template>
  <div>
    <h1>This is gonna be the app</h1>
    <br>
    <div id="canva"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import * as d3 from 'd3'

export default defineComponent({
  name: "AppPage",
  methods: {
    isd3() {

      /* BASIC D3.JS

      // define width and height of canva
      var w = 1400,
          h = 500,
          circleWidth = 40;

      var colors = {
        "user": "red",
        "role": "orange"
      }

      var nodes = [
          {x: w/2, y: h/2, name:"gigi", label:"user"},
          {x: null, y: null, name:"user", label:"role"},
          {x: null, y: null, name:"tom", label:"user"},
          {x: null, y: null, name:"sos", label:"user"},
          {x: null, y: null, name:"ben", label:"user"}
      ]

      function getRandomPos(axis) {
        if(axis === "x") {
          let newW = Math.floor(Math.random() * (w - 2*circleWidth)) + circleWidth
            return newW
        }
        else if(axis === "y") {
          let newH = Math.floor(Math.random() * (h - 2*circleWidth)) + circleWidth
            return newH}
      }

      // visualize nodes in random position
      nodes.forEach((node) => {
        let  x = getRandomPos("x")
        let y = getRandomPos("y")
        node.x = x, node.y = y;
      })

      var links = [
          {source: nodes[0], target: nodes[1]},
          {source: nodes[3], target: nodes[1]},
          {source: nodes[4], target: nodes[1]},
          {source: nodes[2], target: nodes[1]}
      ]

      var vis = d3.select("#canva")
                  .append("svg");

      vis.attr("width", w)
          .attr("height", h);

      // draw relationships
      let relationships = vis.selectAll(".line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", function(d) { return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y })
        .style("stroke", "gray");

      // draw nodes
      let node = vis.selectAll("circle .nodes")
          .data(nodes)
          .enter()
          .append("svg:circle")
          .attr("class", "nodes")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", (circleWidth.toString() + "px"))
          .attr("fill", function(d) { return d.label == "user" ? colors.user : colors.role});
      
      // add text to nodes
      let nodeLabels = vis.selectAll("circle .nodes")
          .data(nodes)
          .enter()
          .append("text")
          .text(function(d) { return d.name; })
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });

      // add text to relationships
      let relationshipsLabels = vis.selectAll(".line")
          .data(links)
          .enter()
          .append("text")
          .text("has role")
          .attr("x", function(d) { return d.source.x + ((d.target.x - d.source.x) / 2); })
          .attr("y", function(d) { return d.source.y + ((d.target.y - d.source.y) / 2); });


      // positioning stuff (?)
      
      BASIC D3.JS */


      /* D3.JS WITH FORCE */

      // var nodes = [{"id":'f1'},{"id":'f2'}, {"id":'f99'}]
      // var links = [{source:'f1',target:'f2'}]

      // var svg = d3.select("#canva")
      //             .append("svg");

      // var width = 1000
      // var height = 1000

      // //define and stop the simulation
      // var simulation = d3.forceSimulation()
      //               .force("center", d3.forceCenter(width/2, height/2))                  
      //               .force("charge", d3.forceManyBody())
      //               .force("link", d3.forceLink().id((d =>   d.id)))
      // simulation.stop()

      // //define links group
      // var my_group = svg.selectAll(".link_group")
      //     .data(links)
      // //exit, remove
      // my_group.exit().remove()
      // //enter
      // var enter = my_group.enter()
      //                     .append("g").attr("class","link_group")
      // //append
      // enter.append("line").attr("class","link_line")
      // //merge
      // my_group = my_group.merge(enter)
      // my_group.select("link_line")
      //         .attr("stroke", "orange")

      // //define nodes group
      // var my_second_group = svg.selectAll(".node_group")
      //     .data(nodes)
      // //exit, remove
      // my_second_group.exit().remove()
      // //enter
      // var enter_2 = my_second_group.enter()
      //                     .append("g").attr("class","node_group")
      // //append 
      // enter_2.append("circle").attr("class","node_circle")
      // //merge
      // my_second_group = my_second_group.merge(enter_2)
      // my_second_group.select("node_circle")
      //         .attr("fill", "orange")
      //         .attr("r",10)

      // simulation.nodes(nodes)
      // simulation.force("link").links(links)

      // simulation.on("tick",function(d){
      //   //position links
      //   d3.selectAll(".link_line")
      //     .attr("x1", d => d.source.x)
      //     .attr("x2", d => d.target.x)
      //     .attr("y1", d => d.source.y)
      //     .attr("y2", d => d.target.y)
      
      //   //position nodes
      //   d3.selectAll(".node_circle")
      //     .attr("x", d => d.x)
      //     .attr("y", d => d.y)
      // })
      // simulation.alpha(1).restart()

      

      /* D3.JS WITH FORCE */

    }
  },
  mounted() {
    this.isd3()
    console.log("aa")
  }
});
</script>
