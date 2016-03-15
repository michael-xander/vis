/**
 * Contains functions to build map to display data
 * Created by Michael on 2016/03/15.
 */

var categoryGraphYAxis;

/*
 * Function generates the graphs for a singular state selection or all state selection
 */
function generateCategoryGraphs(data)
{
    var margin = {top:20, right:20, bottom:30, left:40};

    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    categoryGraphYAxis = y;
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#graph_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height +  margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var genders = ["female", "male"];

    x0.domain(data.categories.map(function(d){
        return d.name;
    }));
    x1.domain(genders).rangeRoundBands([0, x0.rangeBand()]);

    //to be fixed to show actual max of data
    y.domain([0, d3.max(data.categories, function(d){
        return d3.max(d.stats, function(c){
            return c.count;
        });
    })]);

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

    var legend = svg.selectAll(".legend")
        .data(genders.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i){
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "black");

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d){return d;});

}

/*
 * A function that updates the category graph
 */
function updateCategoryGraphs(data)
{
    d3.selectAll("#graph_div svg").remove();
    generateCategoryGraphs(data);
    /*
    var graphDiv = d3.select("#graph_div");
    var svg = graphDiv.select("svg");



    var category = svg.selectAll(".category")
        .data(data.categories)
        .transition();

    //console.log(category);
    //console.log(svg.selectAll("rect"));
    console.log(categoryGraphYAxis);
    svg.selectAll("rect")
        .data(data.categories, function(d){
            return d.stats;
        })
        .transition()
        .attr("y", function(d){
            return categoryGraphYAxis(d.count);
        })
        .attr("height", function(d){
            return height - categoryGraphYAxis(d.count);
        });
    /*
    category.selectAll("rect")
        .data(function(d) {
            return d.stats;
        })
        .transition()
        .attr("y", function(d){
           return categoryGraphYAxis(d.count);
        })
        .attr("height", function(d) {
            return height - y(d.count);
        });*/
}
