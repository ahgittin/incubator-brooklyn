var username = 'admin';
var password = 'password';

var xhr = d3.json('http://localhost:8081/v1/applications/tree');
var base64data = window.btoa(username + ":" + password);
xhr.header("Authorization", "Basic " + base64data);
xhr.get(function(error, json) {
    if (error) return console.warn(error);
    display(json);
});

var width = 1000, height = 800, color = d3.scale.category20c();

var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.children ? d.children.length + 1 : 1; });

function cell() {
    this.style("background", function(d) { return color(d.type); })
        .style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function display(json) {
    d3.select('.brooklyn')
        .data(json)
        .selectAll('div')
        .data(treemap.nodes)
        .enter()
        .append("div")
        .attr("class", "cell")
        .call(cell)
        .text(function(d) { return d.children ? null : d.name; });
}