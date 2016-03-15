/**
 * Contains functions to build map to display data
 * Created by Michael on 2016/03/15.
 */

/*
 * Function generates the graphs for a singular state selection or all state selection
 */
function generateGraphs(data)
{
    //temporary data for testing
    data = {categories : [
        {type : "category", name : "Health & Fitness", stats : [{gender : "male", color: "yellowGreen", count:20},{gender:"female", color:"yellowGreen", count:37}]},
        {type : "category", name : "Humor", stats : [{gender: "male", color:"tomato", count: 45},{gender: "female", color:"tomato", count:67}]},
        {type : "category", name : "Personal Growth", stats : [{gender: "male", color:"sienna", count:56}, {gender:"female", color: "sienna",count:13}]}
    ]};

    width = 960;
    height = 600;

    var margin = {top:20, right:20, bottom:30, left:40};

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width],.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#graph_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height +  margin.top + margin.bottom)
        .style("background-color", "cccccc")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var genders = ["female", "male"];

    x0.domain(data.categories.map(function(d){
        return d.name;
    }));
    x1.domain(genders).rangeRoundBands([0, x0.rangeBand()]);

    //to be fixed to show actual max of data
    y.domain([0, 70]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

    var category = svg.selectAll(".category")
        .data(data.categories)
        .enter()
        .append("g")
        .attr("class", "category")
        .attr("transform", function(d) {
            return "translate(" + x0(d.name) + ",0)";
        });

    category.selectAll("rect")
        .data(function(d) {
            return d.stats;
        })
        .enter()
        .append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) {
            return x1(d.gender);
        })
        .attr("y", function(d){
            return y(d.count);
        })
        .attr("height", function(d){
            return height - y(d.count);
        })
        .attr("fill", function(d) {
            return d.color;
        })
        .style("stroke", "black");

}
