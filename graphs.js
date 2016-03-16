/**
 * Contains functions to build map to display data
 * Created by Michael on 2016/03/15.
 */

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

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#graph_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height +  margin.top + margin.bottom);

    var defs = svg.append("defs");
    var pattern = defs.append("pattern")
        .attr({
            id: "pattern-stripe",
            width:4,
            height: 4,
            patternUnits: "userSpaceOnUse",
            patternTransform: "rotate(45)"
        });
    pattern.append("rect")
        .attr({
            width: 2,
            height: 4,
            transform: "translate(0,0)",
            fill: "white"
        });

    var mask = defs.append("mask")
        .attr("id", "mask-stripe");

    mask.append("rect")
        .attr({
            x: 0,
            y: 0,
            width: "100%",
            height: "100%",
            fill: "url(#pattern-stripe)"
        });

    svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Category: </strong><span style='color:red'>"+ d.category +"</span><br>" +
                "<strong>Gender: </strong><span style='color:red'>"+ d.gender +"</span><br>" +
                "<strong>Population: </strong><span style='color:red'>" + d.count + "</span>";
        });
    svg.call(tip);


    var genders = ["male", "female"];

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
        .attr("class", function(d){
            var className = "male";

            if(d.gender == "female")
            {
                className = "hbar";
            }
            return className;
        })
        .style("stroke", "black")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

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
        .style("fill", "red")
        .attr("class", function(d){
            var className = "male";
            if(d == "female")
            {
                className = "hbar";
            }
            return className;
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d){return d;});

}

/*
 * Returns the color specified for the provided category
 */
function selectCategoryColour(category)
{
    var color;

    switch(category)
    {
        case "Health & Fitness":
            color = "yellowGreen";
            break;
        case "Humor":
            color = "tomato";
            break;
        case "Personal Growth":
            color = "sienna";
            break;
        case "Philanthropic":
            color = "royalBlue";
            break;
        case "Education/Training":
            color = "powderBlue";
            break;
        case "Recreation & Leisure":
            color = "deepPink";
            break;
        case "Family/Friends/Relationships":
            color = "orange";
            break;
        case "Career":
            color = "darkOliveGreen";
            break;
        case "Finance":
            color = "orchid";
            break;
        case "Time Management/Organization":
            color = "rebeccaPurple";
            break;
        default:
            color = "black";
    }
    return color;
}


/*
 * A function that generates the state graphs
 */
function generateStateGraphs(data)
{
    /*
    data = {states: [
        {
            type: "state",
            name: "Sample state",
            stats: [
                {category:"Humor", count:18},
                {category:"Personal Growth", count:22}
            ]
        }
    ]};*/

    var margin = {top:20, right:20, bottom:30, left:40};

    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#state_graph_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height +  margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d){
            return "<strong>State: </strong><span style='color:red'>"+ d.state +"</span><br>" +
                "<strong>Category: </strong><span style='color:red'>" + d.category + "</span><br>" +
                "<strong>Population: </strong><span style='color:red'>"+ d.count +"</span>";
        });

    svg.call(tip);

    var categories = getCategoryNames();

    x0.domain(data.states.map(function(d){
        return d.name;
    }));

    x1.domain(categories).rangeRoundBands([0, x0.rangeBand()]);

    y.domain([0, d3.max(data.states, function(d){
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

    var state = svg.selectAll(".state")
        .data(data.states)
        .enter()
        .append("g")
        .attr("class", "state")
        .attr("transform", function(d){
            return "translate(" + x0(d.name) + ",0)";
        });

    state.selectAll("rect")
        .data(function(d){
            return d.stats;
        })
        .enter()
        .append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d){
            return x1(d.category);
        })
        .attr("y", function(d){
            return  y(d.count);
        })
        .attr("height", function(d){
            return height - y(d.count);
        })
        .attr("fill", function(d){
            return selectCategoryColour(d.category);
        })
        .style("stroke", "black")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
}

/*
 * A function that returns the category names
 */
function getCategoryNames()
{
    var categoryNames = [
        "Health & Fitness",
        "Humor",
        "Personal Growth",
        "Philanthropic",
        "Education/Training",
        "Recreation & Leisure",
        "Family/Friends/Relationships",
        "Career",
        "Finance",
        "Time Management/Organization"
    ];
    return categoryNames;
}

/*
 * A function that updates the category graph
 */
function updateCategoryGraphs(data)
{
    d3.selectAll("#graph_div svg").remove();
    generateCategoryGraphs(data);
}

/*
 * A function that removes the state graphs
 */
function deleteStateGraphs()
{
    d3.selectAll("#state_graph_div svg").remove();
}

/*
 * A function that updates the state graph
 */
function updateStateGraphs(data)
{
    deleteStateGraphs();
    generateStateGraphs(data);
}
