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
        .style("display", "block")
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
        .attr("class", "d3-tip-graph")
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
        .style("fill", "white")
        .style("font-size", "14")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("fill", "white")
        .style("font-size", "14")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "white")
            .style("font-size", "14")
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

    generateCategoryGraphLegend(height, width/4);
}

/*
 * A function to generate the legend for the category graph
 */
function generateCategoryGraphLegend(height, width)
{
    var category_img = ['', '', 'img/ph.png', 'img/pe.png', 'img/ed.png', 'img/he.png', 'img/re.png', 'img/fa.png','img/ca.png', 'img/fi.png', 'img/ti.png', 'img/hu.png' ];

    var svg = d3.select("#graph_div")
        .append("svg")
        .attr("width", width+30)
        .attr("height", height+30);

    var items = ["Male", "Female"];

    var categoryNames = getCategoryNames();
    for(var i = 0; i < categoryNames.length; i++)
    {
        items.push(categoryNames[i]);
    }

    var legend = svg.selectAll(".legend")
        .data(items.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i){
            return "translate(0," + i * 40 + ")";
        });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", function(d){
            return selectCategoryColour(d);
        })
        .attr("class", function(d){
            var className = "male";
            if(d == "Female")
            {
                className = "hbar";
            }
            return className;
        });

     legend.append('image')
             .data(category_img)
             .attr('xlink:href',function (d){
                 return d;})
             //.attr('class', 'pico')
             .attr('height', '30')
             .attr('width', '30')
             .attr("x", width);
             //.attr("y", 20);

    legend.append("text")
        .attr("x", width - 6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('fill', 'white')
        .style("font-size", "14")
        .text(function(d){return d;});
}

/*
 * Generates the graphs for comparison of state data
 */
function generateStateComparisonGraphs(data, stateNames)
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

    var svg = d3.select("#state_graph_div")
        .style("display", "block")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height +  margin.top + margin.bottom);

    var defs = svg.append("defs");
    var pattern = defs.append("pattern")
        .attr({
            id: "state-pattern-stripe",
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
            fill: "yellow"
        });

    var mask = defs.append("mask")
        .attr("id", "state-mask-stripe");

    mask.append("rect")
        .attr({
            x: 0,
            y: 0,
            width: "100%",
            height: "100%",
            fill: "url(#state-pattern-stripe)"
        });

    svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr("class", "d3-tip-graph")
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>State: </strong><span style='color:red'>" + d.state + "</span><br>" +
                "<strong>Category: </strong><span style='color:red'>" + d.category + "</span><br>" +
                "<strong>Male population: </strong><span style='color:red'>" + d.maleCount + "</span><br>" +
                "<strong>Female population: </strong><span style='color:red'>" + d.femaleCount + "</span><br>" +
                "<strong>Total population: </strong><span style='color:red'>" + d.count + "</span>";
        });
    svg.call(tip);

    x0.domain(data.categories.map(function(d){
        return d.name;
    }));
    x1.domain(stateNames).rangeRoundBands([0, x0.rangeBand()]);

    //to be fixed to show actual max of data
    y.domain([0, d3.max(data.categories, function(d){
        return d3.max(d.stats, function(c){
            return c.count;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("fill", "white")
        .style("font-size", "14")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("fill", "white")
        .style("font-size", "14")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "white")
        .style("font-size", "14")
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
            return x1(d.state);
        })
        .attr("y", function(d){
            return y(d.count);
        })
        .attr("height", function(d){
            return height - y(d.count);
        })
        .attr("fill", function(d) {
            return selectCategoryColour(d.category);
        })
        .attr("class", function(d){
            var className = "first-state";

            if(d.state == stateNames[1])
            {
                className = "hbar-state";
            }
            return className;
        })
        .style("stroke", "black")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    generateStateComparisonGraphLegend(stateNames, height, width/4);
}

function generateStateComparisonGraphLegend(stateNames, height, width)
{
    var category_img = ['', '', 'img/ph.png', 'img/pe.png', 'img/ed.png', 'img/he.png', 'img/re.png', 'img/fa.png','img/ca.png', 'img/fi.png', 'img/ti.png', 'img/hu.png' ];

    var svg = d3.select("#state_graph_div")
        .append("svg")
        .attr("width", width+30)
        .attr("height", height+30);

    var categoryNames = getCategoryNames();

    for(var i = 0; i < categoryNames.length; i++)
    {
        stateNames.push(categoryNames[i]);
    }

    var legend = svg.selectAll(".legend")
        .data(stateNames.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i){
            return "translate(0," + i * 40 + ")";
        });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", function(d){
            return selectCategoryColour(d);
        })
        .attr("class", function(d){
            var className = "first-state";
            if(d == stateNames[1])
            {
                className = "hbar-state";
            }
            return className;
        });

     legend.append('image')
             .data(category_img)
             .attr('xlink:href',function (d){
                 return d;})
             //.attr('class', 'pico')
             .attr('height', '30')
             .attr('width', '30')
             .attr("x", width );
             //.attr("y", 50);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('fill', 'white')
        .style("font-size", "14")
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
            color = "#7E3517";
            break;
        case "Personal Growth":
            color = "orchid";
            break;
        case "Philanthropic":
            color = "sienna";
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
            color = "royalBlue";
            break;
        case "Time Management/Organization":
            color = "rebeccaPurple";
            break;
        default:
            color = "white";
    }
    return color;
}



/*
 * A function that returns the category names
 */
function getCategoryNames()
{
    var categoryNames = [
        
        "Philanthropic",
        "Personal Growth",
        "Education/Training",
        "Health & Fitness",
        "Recreation & Leisure",
        "Family/Friends/Relationships",
        "Career",
        "Finance",
        "Time Management/Organization",
        "Humor"
    ];
    return categoryNames;
}

/*
 * A function that updates the category graph
 */
function updateCategoryGraphs(data)
{
    deleteCategoryGraphs();
    generateCategoryGraphs(data);
}

/*
 * A function that removes the category graphs
 */
function deleteCategoryGraphs()
{
    d3.select("#graph_div")
        .style("display", "none");
    d3.selectAll("#graph_div svg").remove();
}

/*
 * A function that removes the state graphs
 */
function deleteStateGraphs()
{
    d3.select("#state_graph_div")
        .style("display", "none");
    d3.selectAll("#state_graph_div svg").remove();
}

