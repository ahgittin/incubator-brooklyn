/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/
define([
    "underscore", "jquery", "backbone", "brooklyn-utils",
    "d3",
    "text!tpl/apps/tree-d3/index.html" 
], function (_, $, Backbone, Util, D3, TreeD3Html) {

    var TreeD3View = Backbone.View.extend({
        tagName:"div",
        className:"container container-fluid",

        initialize:function () {
        },
        render:function (eventName) {
            var that = this
            log("d3 teplate")
            this.$el.html(_.template(TreeD3Html, {}))
            _.defer(function() { that.loadTree() })
            return this
        },
        
        loadTree: function() {
            log("d3 load")
            log(this.$el.closest(".container").offset());
            var 
                m = [40, 40, 200, 40],
                w = 980 - m[1] - m[3],
                h = window.innerHeight - this.$el.closest(".container").offset().top - m[0] - m[2],
                i = 0,
                root,
                nodes = {}
            
            var tree = d3.layout.tree()
                .size([w, h])
                ;

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.x, d.y]; });

            log("d3 select", d3.select("#tree-d3"))
            
            var vis = d3.select("#tree-d3").append("svg:svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
              .append("svg:g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            root = { name: "Brooklyn", childrenLoaded: false, childrenLink: "/v1/applications"
            , x0: w/2, y0: 0
                    }
            update(root)

            d3.json(root.childrenLink, function(json) {
                updateRoot(json)
            });

            function updateRoot(newChildren) {
                var newNodeChildren = []
                for (ci in newChildren) {
                    var c = newChildren[ci]
                    log("ROOT CHILD", c)
                    var n = nodes[c.links.self] || { childrenLoaded: false }
                    n.id = c.links.self;
                    n.name = c.spec.name; 
                    n.childrenLink = c.links.entities;
                    nodes[n.id] = n
                    newNodeChildren.push(n)
                }
                root.childrenCached = newNodeChildren
                root.children = newNodeChildren
                root.childrenLoaded = true
                
                update(root)
            }
            
            function updateNode(node, newChildren) {
                if (node.childrenLoaded) {
                    // TODO remove any old children not in newChildren list, using nodes item
                    // (or maybe not necessary?)
                }
                
                var newNodeChildren = []
                for (ci in newChildren) {
                    var c = newChildren[ci]
                    log("NODE CHILD", c)
                    var n = nodes[c.id] || { childrenLoaded: false }
                    n.id = c.id;
                    n.name = c.name; 
                    n.childrenLink = c.links.children;
                    nodes[n.id] = n
                    newNodeChildren.push(n)
                }
                log("new node children")
                log(newNodeChildren)
                node.childrenCached = newNodeChildren
                node.children = newNodeChildren
                node.childrenLoaded = true
                
                update(node)
            }
            
            // Toggle children -- reload if necessary
            function toggle(d) {
              log("toggling ", d)
              if (d.childrenLoaded) {
                  // toggle
                  if (d.children) {
                      d.children = null;
                  } else {
                      d.children = d.childrenCached;
                  }
                  update(d)
              } else {
                  log("LOADING children ",d)
                  d3.json(d.childrenLink, function(json) {
                      log("LOADED children ",d)
                      updateNode(d, json)
                  });
              }
            }

            function update(source) {
              var duration = d3.event && d3.event.altKey ? 6000 : 300;

              // Compute the new tree layout.
              var nodes = tree.nodes(root)
                .reverse()
                ;
              
              log("updating")
              log(source);

              // Normalize for fixed-depth.
//              nodes.forEach(function(d) {                  
//                d.y = d.depth * 180; });

              // Update the nodes…
              var node = vis.selectAll("g.node")
                  .data(nodes, function(d) { return d.id || (d.id = ++i); });
                  
              var nodesOldOrder = vis.selectAll("g.node")[0]
              
              vis.selectAll("g.node").sort(function (a, b) {
                // cheap and cheerful way to make this node appear at the top
                if (a.id == source.id) return 1;
                log(a);
                return 0;
              });

              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append("svg:g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
                  .on("click", function(d) { toggle(d); update(d); });

              var circleColor = function(d) {
                  var colour = 
                  // red if not loaded; 
                  !d.childrenLoaded ? "#900" : 
                  // black if can be collapsed 
                  !d.childrenCached || d.children ? "#000" : 
                  // white if fully expanded (and if childless) 
                  "#fff"; 
                  return colour;
              }
              
              nodeEnter.append("svg:circle")
                  .attr("r", 1e-6)
                  .style("stroke", "black")
                  .style("fill", circleColor);
                  
              nodeEnter.append("svg:rect")
                  .attr("width", 200)
                  .attr("height", 120)
                  .attr("transform", "translate(-100,0)")
                  .style("fill", "white")
                  .attr("rx", 10)
                  .attr("ry", 10)
                  .style("stroke-width", "3px")
                  .style("stroke", "black");

              nodeEnter.append("svg:text")
                  .attr("x", function(d) { return 
                    0; //-this.getComputedTextLength();
                    // d.children || d.childrenCached ? -10 : 10; 
                    })
                  .attr("dy", "25px")
                  .attr("text-anchor", "middle")
                  .text(function(d) { return d.name; })
                  .attr("class", "title")
                  .style("fill-opacity", 1e-6);

              // Transition nodes to their new position.
              var nodeUpdate = node.transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                  ;

              nodeUpdate.select("circle")
                  .attr("r", 6)
                  .style("fill", circleColor);

              nodeUpdate.select("rect")
                  .attr("height", function(d) { return !d.childrenLoaded || (d.childrenCached && !d.children) ? 120 : 40; });

              nodeUpdate.select("text")
                  .attr("__ignored_x", function(d,i) {
                      log("text", d, i)
                      log(this.getComputedTextLength())
                      return d.children ? -10-this.getComputedTextLength() : 10; })
                  .style("fill-opacity", 1);

              // Transition exiting nodes to the parent's new position.
              var nodeExit = node.exit().transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
                  .remove();

              nodeExit.select("circle")
                  .attr("r", 1e-6);

              nodeExit.select("text")
                  .style("fill-opacity", 1e-6);

              // Update the links…
              var link = vis.selectAll("path.link")
                  .data(tree.links(nodes), function(d) { return d.target.id; });

              // Enter any new links at the parent's previous position.
              link.enter().insert("svg:path", "g")
                  .attr("class", "link")
                  .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                  })
                .transition()
                  .duration(duration)
                  .attr("d", diagonal);

              // Transition links to their new position.
              link.transition()
                  .duration(duration)
                  .attr("d", diagonal);

              // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                  .duration(duration)
                  .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                  })
                  .remove();

              // Stash the old positions for transition.
              nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
              });
              log("nodes are ",nodes)
            }
            
        }

    })
    
    return TreeD3View
})
