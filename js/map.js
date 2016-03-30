/**
 * Contains functions to build map to display data
 * Created by Michael on 2016/03/14.
 */

//the current centered object on the map and container for states
var centered, g;
//the current path utilised for the map
var path;

//the height and width of the map
var width, height;


//sizes for the circles and radius
var circleRadius = 4.2;
var rectLength = circleRadius * 2;
var pointBoundarySize = 1.3;
/*
 * Function called on clicking on a state or on the map
 */
function clicked(d)
{
    var x, y, k;

    if(d && centered !== d)
    {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    }
    else
    {
        x = width/2;
        y = height/2;
        k = 1;
        centered = null;
    }

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

}


/*
 * Generates the map to be displayed
 */
function generateMap()
{
    //width and height
    width = 960;
    height = 600;

    //define the map projection
    var projection = d3.geo.albersUsa()
        .scale(1280)
        .translate([width/2, height/2]);

    // define default path generator
    path = d3.geo.path()
        .projection(projection);

    //create the svg element
    var svg = d3.select("#map_div")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked);

    g = svg.append("g");

    var tip = d3.tip()
        .attr("class", "d3-tip-map")
        .offset([-10, 0])
        .html(function(d){
            return "<strong>Handle:@</strong><span style='color:white'>" + d.handle + "</span><br>" +
                "<strong>Gender: </strong><span style='color:white'>" + d.gender + "</span><br>" +
                "<strong>Tweet: </strong><span style='color:white'>" + d.tweet + "</span><br>" +
                "<strong>Category: </strong><span style='color:white'>" + d.category + "</span><br>" +
                "<strong>Topic: </strong><span style='color:white'>" + d.topic + "</span><br>" +
                "<strong>Location: </strong><span style='color:white'>" + d.location + "</span><br>" +
                "<strong>State: </strong><span style='color:white'>" + d.state + "</span>";
        });

    svg.call(tip);

    // load the compiled data
    d3.csv("data/compilation.csv", function(data)
    {
        // load the GeoJSON data for the states
        d3.json("data/us-states.json", function(json){
            //bind data and create one path per GeoJSON feature
            g.append("g")
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class", "state_path")
                .attr("d", path)
                .style("fill","cccccc")
                .style("stroke", "white")
                .on("click", clicked);

            //fill the drop down boxes for states
            fillStateSelectionDropdowns(json.features);

            //iterating through data to separate males and females

            var females = [];
            var males = [];
            for(var i = 0; i < data.length; i++)
            {
                if(data[i].gender == "male")
                {
                    males.push(data[i]);
                }
                else
                {
                    females.push(data[i]);
                }
            }

            //males to be represented with circles that have white boundaries. Circles will have class "male-points"
            //general class for points will be "data-points"
            var circles = g.selectAll(".male-points")
                .data(males)
                .enter()
                .append("circle")
                .attr("class", "male-points data-points")
                .attr("cx", function(d){
                    return projection([d.long, d.lat])[0];
                })
                .attr("cy", function(d){
                    return projection([d.long, d.lat])[1];
                })
                .attr("r", circleRadius)
                .attr("stroke", "white")
                .attr("stroke-width", pointBoundarySize)
                .style("fill", function(d) {
                    return selectCategoryColour(d.category);
                })
                .style("opacity", 1)
                .on("mouseover", function(d) {

                    //double the circles radius and fill it black
                    d3.select(this)
                        .attr("r", circleRadius*2)
                        .style("fill", "black");
                    tip.show(d);
                })
                .on("mouseout", function(){

                    //return the cirle to original radius and colour
                    d3.select(this)
                        .attr("r", circleRadius)
                        .style("fill", function(d){
                            return selectCategoryColour(d.category);
                        });
                    tip.hide();
                });

            //females to be represented with rectangles that have white boundaries.
            //rectangles to be given the class "female-points"
            var rectangles = g.selectAll(".female-points")
                .data(females)
                .enter()
                .append("rect")
                .attr("class", "female-points data-points")
                .attr("width", rectLength) //maintain same size distributions as circles
                .attr("height", rectLength)
                .attr("x", function(d) {
                    return projection([d.long, d.lat])[0];
                })
                .attr("y", function(d) {
                    return projection([d.long, d.lat])[1];
                })
                .attr("stroke", "white")
                .attr("stroke-width", pointBoundarySize)
                .style("fill", function(d){
                    return selectCategoryColour(d.category);
                })
                .style("opacity", 1)
                .on("mouseover", function(d) {

                    // double the rectangle's width and height plus fill it black
                    d3.select(this)
                        .attr("width", rectLength*2)
                        .attr("height", rectLength*2)
                        .style("fill", "black");
                    tip.show(d);
                })
                .on("mouseout", function()
                {
                    d3.select(this)
                        .attr("width", rectLength)
                        .attr("height", rectLength)
                        .style("fill", function(d){
                            return selectCategoryColour(d.category);
                        });
                    tip.hide();
                });


            //adding listener to each category checkbox
            setCategoryCheckboxListener();
            //adding listener to each gender checkbox
            setGenderCheckboxListener();

            //select all the data points
            var dataPoints = d3.selectAll(".data-points");
            //generate graph data
            var graphData = generateCategoryGraphData(dataPoints);
            //generate the graphs
            generateCategoryGraphs(graphData);

        });
    });
    generateMapLegend();
}

/*
 * A function to generate the legend of the map
 */
function generateMapLegend()
{
    var legend_height = height;
    var legend_width = width/4;
    var category_img = ['img/ph.png', 'img/pe.png', 'img/ed.png', 'img/he.png', 'img/re.png', 'img/fa.png','img/ca.png', 'img/fi.png', 'img/ti.png', 'img/hu.png' ];

    var svg = d3.select("#map_div")
        .append("svg")
        .attr("width", legend_width+40)
        .attr("height", legend_height);

    var legend = svg.selectAll(".legend")
        .data(getCategoryNames().slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i){
            return "translate(0," + i * 40 + ")";
        });

    legend.append("rect")
        .attr("x", legend_width)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", function(d){
            return selectCategoryColour(d);
        });

   legend.append('image')
        .data(category_img)
        .attr('xlink:href',function (d){
            return d;})
       // .attr('class', 'pico')
        .attr('height', 30)
        .attr('width', 30)
        .attr("x", legend_width);

    legend.append("text")
        .attr("x", legend_width-6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('fill', 'white')
        .style("font-size", "14")
        .text(function(d){
            return d;
        });
}

/*
 * Function to fill the drop downs for selecting states
 */
function fillStateSelectionDropdowns(features)
{
    for(var i=0; i < 2; i++)
    {
        var dropDown = d3.selectAll("select")
            .filter(function(){
                if(i == 0)
                {
                    return this.name == "state-1";
                }
                else
                {
                    return this.name == "state-2";
                }
            })
            .on("change", stateSelectionChanged);

        var options = dropDown.selectAll("option")
            .data(features)
            .enter()
            .append("option");

        options.text(function(d){
                return d.properties.name;
            })
            .attr("value", function(d){
                return d.properties.name;
            });
    }
}

/*
 * A function to set the listener event for the category checkboxes
 */
function setCategoryCheckboxListener()
{
    d3.selectAll(".category_checkbox")
        .on("change", filterMap);
}

/*
 * A function to set the listener event for the gender checkboxes
 */
function setGenderCheckboxListener()
{
    d3.selectAll(".gender_checkbox")
        .on("change", filterMap);
}

/*
 * Function called when the drop down selection of state changes
 */
function stateSelectionChanged() {
    //var selectedValue = d3.event.target.value;

    // get the current selected states from both drop down boxes
    var selected_state_1 = d3.select("#state_1").node().value;
    var selected_state_2 = d3.select("#state_2").node().value;

    //console.log(d3.select("#state_1").node().value);
    //console.log(d3.select("#state_2").node().value);

    var paths = d3.selectAll(".state_path")
        .style("fill", "cccccc");

    paths = paths.filter(function(d){
        var state_name = d.properties.name;
        //console.log(d3.select(this).style("fill"));

        return ((selected_state_1 == state_name) || (selected_state_2 == state_name));
    });

    paths.style("fill", "khaki");
    filterMap();
}

/*
 * A function that filters the map according to selections made.
 */
function filterMap()
{
    //filter by states
    var selected_state_1 = d3.select("#state_1").node().value;
    var selected_state_2 = d3.select("#state_2").node().value;

    //remove all points
    var dataPoints = d3.selectAll(".data-points")
        .style("display", "none");

    var null_state = "-- select a state --";

    if((selected_state_1 == null_state) && (selected_state_2 == null_state))
    {
        //if no states chosen, put back all points
    }
    else
    {
        //select circles that fit the states picked
        dataPoints = dataPoints.filter(function(d){
            return ((d.state == selected_state_1) || (d.state == selected_state_2));
        });
    }

    var checkedGenders = d3.selectAll(".gender_checkbox")
        .filter(function(){
            return this.checked;
        });

    dataPoints = dataPoints.filter(function(d){
        var matched_gender = false;

        checkedGenders.each(function(){
            if(d.gender == this.value)
            {
                matched_gender = true;
            }
        });
        return matched_gender;
    });


    var checkedCategories = d3.selectAll(".category_checkbox")
        .filter(function(){
            return this.checked;
        });

    dataPoints = dataPoints.filter(function(d){
        var matched_category = false;

        checkedCategories.each(function(){
            if(d.category == this.value)
            {
                matched_category = true;
            }
        });
        return matched_category;
    });

    dataPoints.style("display", "inline");

    //generate new data for the category graphs
    var graphData = generateCategoryGraphData(dataPoints);


    deleteCategoryGraphs();
    deleteStateGraphs();

    //checking whether to update state comparison data
    if((selected_state_1 == null_state) && (selected_state_2 == null_state))
    {
        // no states picked so remove state graphs
        updateCategoryGraphs(graphData);
    }
    else if((selected_state_1 != null_state) && (selected_state_2 != null_state))
    {
        //same state picked in either checkbox so no need to show state comparison graph
        if(selected_state_1 == selected_state_2)
        {
            updateCategoryGraphs(graphData);
        }
        else
        {
            var stateGraphData = generateStateComparisonData(dataPoints, [selected_state_1, selected_state_2]);
            generateStateComparisonGraphs(stateGraphData, [selected_state_1, selected_state_2]);
        }
    }
    else if(selected_state_1 != null_state)
    {
        updateCategoryGraphs(graphData);
    }
    else
    {
        updateCategoryGraphs(graphData);
    }
}

/*
 * Returns the colour specified for the provided gender
 */
function selectGenderColour(gender)
{
    var colour;

    if(gender == "male")
    {
        colour = "black";
    }
    else
    {
        colour = "white";
    }

    return colour;
}


/*
 *A function to generate graph data from cirlces present in the map
 */
function generateCategoryGraphData(dataPoints)
{
    var categoryNames = getCategoryNames();

    var data = {categories: []};

    var categoryDataMap = {};
    //build up the data object
    for(var i = 0; i < categoryNames.length; i++)
    {
        var categoryName = categoryNames[i];
        var categoryData = {
            type : "category",
            name : categoryName.charAt(0) + categoryName.charAt(1),
            stats : [
                {gender : "male", category: categoryName, color : selectCategoryColour(categoryNames[i]), count:0 },
                {gender : "female", category: categoryName, color : selectCategoryColour(categoryNames[i]), count:0}
            ]
        };

        categoryDataMap[categoryNames[i]] = categoryData;
        data.categories.push(categoryData);
    }

    //selecting and iterating through the data points


    dataPoints.each(function(d){

        if(d.gender == "male")
        {
            var currentCount = categoryDataMap[d.category].stats[0].count;
            categoryDataMap[d.category].stats[0].count = currentCount + 1;
        }
        else
        {
            var currentCount = categoryDataMap[d.category].stats[1].count;
            categoryDataMap[d.category].stats[1].count = currentCount +1;
        }
    });
    return data;
}

/*
 * A function that generates data for state comparison graph
 */
function generateStateComparisonData(dataPoints, stateNames)
{
    var categoryNames = getCategoryNames();

    var data = {categories:[]};

    var categoryDataMap = {};

    //build up the data object
    for(var i = 0; i < categoryNames.length; i++)
    {
        var categoryName = categoryNames[i];
        var categoryData = {
            type: "category",
            name: categoryName.charAt(0) + categoryName.charAt(1),
            stats: [
                {state: stateNames[0], category: categoryName, count: 0, femaleCount: 0, maleCount: 0},
                {state: stateNames[1], category: categoryName, count: 0, femaleCount: 0, maleCount: 0}
            ]
        };
        categoryDataMap[categoryNames[i]] = categoryData;
        data.categories.push(categoryData);
    }

    //iterating through the data points to get the different data
    dataPoints.each(function(d){
        if(d.state == stateNames[0])
        {
            var currentCount = categoryDataMap[d.category].stats[0].count;
            categoryDataMap[d.category].stats[0].count = currentCount + 1;

            if(d.gender == "male")
            {
                var maleCount = categoryDataMap[d.category].stats[0].maleCount;
                categoryDataMap[d.category].stats[0].maleCount = maleCount + 1;
            }
            else
            {
                var femaleCount = categoryDataMap[d.category].stats[0].femaleCount;
                categoryDataMap[d.category].stats[0].femaleCount = femaleCount + 1;
            }
        }
        else if(d.state == stateNames[1])
        {
            var currentCount = categoryDataMap[d.category].stats[1].count;
            categoryDataMap[d.category].stats[1].count = currentCount + 1;

            if(d.gender == "male")
            {
                var maleCount = categoryDataMap[d.category].stats[1].maleCount;
                categoryDataMap[d.category].stats[1].maleCount = maleCount + 1;
            }
            else
            {
                var femaleCount = categoryDataMap[d.category].stats[1].femaleCount;
                categoryDataMap[d.category].stats[1].femaleCount = femaleCount + 1;
            }
        }
    });
    return data;
}
