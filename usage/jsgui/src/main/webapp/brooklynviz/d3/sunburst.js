var username = 'admin';
var password = 'password';

var xhr = d3.json('http://localhost:8081/v1/applications/tree');
var base64data = window.btoa(username + ":" + password);
xhr.header("Authorization", "Basic " + base64data);
xhr.get(function(error, json) {
    if (error) return console.warn(error);
    display(json);
});

var width = 1000, height = 800,
    radius = Math.min(width, height) / 2,
    x = d3.scale.linear().range([0, 2 * Math.PI]),
    y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
    padding = 5,
    color = d3.scale.category20c();

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return sizeof(d); });

function display(json) {
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height * .4 + ")");

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    svg.datum(json[0])
        .selectAll("path")
        .data(partition.nodes)
        .enter()
        .append("path")
        .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
        .attr("d", arc)
        .style("stroke", "#fff")
        .style("fill", function(d) { return color(d.type); })
        .style("fill-rule", "evenodd");

    svg.selectAll("text.label")
        .data(partition.nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill", "black")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .text(function(d, i) { return d.name;} );

    d3.select(self.frameElement).style("height", height + "px");
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