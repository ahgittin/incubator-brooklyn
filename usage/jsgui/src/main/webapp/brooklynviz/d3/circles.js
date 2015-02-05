var username = 'admin';
var password = 'password';

var xhr = d3.json('http://localhost:8081/v1/applications/tree');
var base64data = window.btoa(username + ":" + password);
xhr.header("Authorization", "Basic " + base64data);
xhr.get(function(error, json) {
    if (error) return console.warn(error);
    display(json);
});

var w = 1000,
    h = 800,
    r = Math.min(w, h) * 0.8,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    color = d3.scale.category20c();

var node, root, svg;

var pack = d3.layout.pack()
    .sort(null)
    .size([r, r])
    .value(function(d) { return sizeof(d); });

function display(json) {
    node = root = json[0];

    svg = d3.select("body")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

    var nodes = pack.nodes(root);

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("svg:circle")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.type); })
        .on("click", function(d) { return zoom(node == d ? root : d); });

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("svg:text")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y - (d.children ? d.r * 0.2 : 0); })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { return d.r > 50 ? 1 : 0.25; })
        .text(function(d) { return d.name; });

    d3.select(window).on("click", function() { zoom(root); });
}

function sizeof(d) {
    var size = 1;
    if (d.children) {
        d.children.forEach(function(child) {
            size += sizeof(child);
        });
    }
    return size;
}

function zoom(d, i) {
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = svg.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", function(d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y) - (d.children ? k * d.r * 0.2 : 0); })
        .style("opacity", function(d) { return d.r > (50 / k) ? 1 : 0.25; });

    node = d;
    d3.event.stopPropagation();
}