/**
 * Contains functions to build map to display data
 * Created by Michael on 2016/03/14.
 */

/*
 * Generates the map to be displayed
 */
function generateMap()
{
    //width and height
    var width = 960;
    var height = 600;

    //define the map projection
    var projection = d3.geo.albersUsa()
        .scale(1280)
        .translate([width/2, height/2]);

    // define default path generator
    var path = d3.geo.path()
        .projection(projection);

    //create the svg element
    var svg = d3.select("#map_div")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    // load the compiled data
    d3.csv("compilation.csv", function(data)
    {
        // load the GeoJSON data for the states
        d3.json("us-states.json", function(json){
            //bind data and create one path per GeoJSON feature
            paths = svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("class", "state_path")
                .attr("d", path)
                .style("fill","cccccc")
                .style("stroke", "white");

            //fill the drop down boxes for states
            fillStateSelectionDropdowns(json.features);

            //set up circles for the different locations
            circles = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d){
                    return projection([d.long, d.lat])[0];
                })
                .attr("cy", function(d){
                    return projection([d.long, d.lat])[1];
                })
                .attr("r", 5)
                .attr("stroke", function(d){
                    return selectGenderColour(d.gender);
                })
                .attr("stroke-width", 2)
                .style("fill", function(d) {
                    return selectCategoryColour(d.category);
                })
                .style("opacity", 1)
                .on("mouseover", function(d){
                    // what happens when a point is hovered over

                    //obtain x and y values for the tooltip to appear
                    var xPosition = parseFloat(d3.select(this).attr("cx")) + 20;
                    var yPosition = parseFloat(d3.select(this).attr("cy")) + 55;

                    //update the tooltip position and values
                    d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px");

                    //fill in the fields in the tooltip
                    d3.select("#tooltip")
                        .select("#tweet_handle")
                        .text(d.handle);

                    d3.select("#tooltip")
                        .select("#gender")
                        .text(d.gender);

                    d3.select("#tooltip")
                        .select("#tweet")
                        .text(d.tweet);

                    d3.select("#tooltip")
                        .select("#category")
                        .text(d.category);

                    d3.select("#tooltip")
                        .select("#topic")
                        .text(d.topic);

                    d3.select("#tooltip")
                        .select("#location")
                        .text(d.location);

                    //show the tooltip
                    d3.select("#tooltip").classed("hidden", false);

                    //double the circle radius for the point
                    d3.select(this)
                        .attr("r", 10);

                })
                .on("mouseout", function(){
                    //what happens when overing over a point is done
                    //hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);

                    //set back to the original colour for the point
                    d3.select(this)
                        .attr("r", 5)
                        .style("fill", function(d){
                            return selectCategoryColour(d.category);
                        });
                });

            //adding listener to each category checkbox
            setCategoryCheckboxListener();
            //adding listener to each gender checkbox
            setGenderCheckboxListener();

            //generate graph data
            var graphData = generateCategoryGraphData(circles);
            //generate the graphs
            generateCategoryGraphs(graphData);

        });
    });

}

/*
 * Function to fill the drop downs for selecting states
 */
function fillStateSelectionDropdowns(features)
{
    for(var i=0; i < 2; i++)
    {
        dropDown = d3.selectAll("select")
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

    paths = d3.selectAll(".state_path")
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
    circles = d3.selectAll("circle")
        .style("display", "none");

    var null_state = "-- select a state --";

    if((selected_state_1 == null_state) && (selected_state_2 == null_state))
    {
        //if no states chosen, put back all points
    }
    else
    {
        //select circles that fit the states picked
        circles = circles.filter(function(d){
            return ((d.state == selected_state_1) || (d.state == selected_state_2));
        });
    }

    checkedGenders = d3.selectAll(".gender_checkbox")
        .filter(function(){
            return this.checked;
        });

    circles = circles.filter(function(d){
        var matched_gender = false;

        checkedGenders.each(function(){
            if(d.gender == this.value)
            {
                matched_gender = true;
            }
        });
        return matched_gender;
    });


    checkedCategories = d3.selectAll(".category_checkbox")
        .filter(function(){
            return this.checked;
        });

    circles = circles.filter(function(d){
        var matched_category = false;

        checkedCategories.each(function(){
            if(d.category == this.value)
            {
                matched_category = true;
            }
        });
        return matched_category;
    });

    circles.style("display", "inline");

    //generate new data for the category graphs
    graphData = generateCategoryGraphData(circles);

    //update the category graphs
    updateCategoryGraphs(graphData);

    //checking whether to update state graph data

    if((selected_state_1 == null_state) && (selected_state_2 == null_state))
    {
        // no states picked so remove state graphs
        deleteStateGraphs();
    }
    else if((selected_state_1 != null_state) && (selected_state_2 != null_state))
    {
        var stateGraphData = generateStateGraphData(circles, [selected_state_1, selected_state_2]);
        updateStateGraphs(stateGraphData);
    }
    else if(selected_state_1 != null)
    {
        var stateGraphData = generateCategoryGraphData(circles, [selected_state_1]);
        updateStateGraphs(stateGraphData);
    }
    else
    {
        var stateGraphData = generateCategoryGraphData(circles, [selected_state_2]);
        updateStateGraphs(stateGraphData);
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
 * A function to generate graph data for the state graphs
 */
function generateStateGraphData(circles, stateNames)
{
    var data = {states: []};

    var stateDataMap = {};
    var categoryNames = getCategoryNames();
    for(var i = 0; i < stateNames.length; i++)
    {
        var stateName = stateNames[i];
        var stateData = {
            type: "state",
            name: stateName,
            stats : []
        };

        for(var k = 0; k < categoryNames.length; k++)
        {
            var categoryData = {
                category: categoryNames[k],
                count: 0
            };
            stateData.stats.push(categoryData);
        }
        stateDataMap[stateNames[i]] = stateData;
        data.states.push(stateData);
    }

    // iteration through the circles to complete the data

    circles.each(function(d){

        switch(d.category)
        {
            case "Health & Fitness":
                var currentCount = stateDataMap[d.state].stats[0].count;
                stateDataMap[d.state].stats[0].count = currentCount + 1;
                break;
            case "Humor":
                var currentCount = stateDataMap[d.state].stats[1].count;
                stateDataMap[d.state].stats[1].count = currentCount + 1;
                break;
            case "Personal Growth":
                var currentCount = stateDataMap[d.state].stats[2].count;
                stateDataMap[d.state].stats[2].count = currentCount + 1;
                break;
            case "Philanthropic":
                var currentCount = stateDataMap[d.state].stats[3].count;
                stateDataMap[d.state].stats[3].count = currentCount + 1;
                break;
            case "Education/Training":
                var currentCount = stateDataMap[d.state].stats[4].count;
                stateDataMap[d.state].stats[4].count = currentCount + 1;
                break;
            case "Recreation & Leisure":
                var currentCount = stateDataMap[d.state].stats[5].count;
                stateDataMap[d.state].stats[5].count = currentCount + 1;
                break;
            case "Family/Friends/Relationships":
                var currentCount = stateDataMap[d.state].stats[6].count;
                stateDataMap[d.state].stats[6].count = currentCount + 1;
                break;
            case "Career":
                var currentCount = stateDataMap[d.state].stats[7].count;
                stateDataMap[d.state].stats[7].count = currentCount + 1;
                break;
            case "Finance":
                var currentCount = stateDataMap[d.state].stats[8].count;
                stateDataMap[d.state].stats[8].count = currentCount + 1;
                break;
            case "Time Management/Organization":
                var currentCount = stateDataMap[d.state].stats[9].count;
                stateDataMap[d.state].stats[9].count = currentCount + 1;
                break;
        }

    });
    return data;
}
/*
 *A function to generate graph data from cirlces present in the map
 */

function generateCategoryGraphData(circles)
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
                {gender : "male", color : selectCategoryColour(categoryNames[i]), count:0 },
                {gender : "female", color : selectCategoryColour(categoryNames[i]), count:0}
            ]
        };

        categoryDataMap[categoryNames[i]] = categoryData;
        data.categories.push(categoryData);
    }

    //iterating through the circles to get complete the data

    circles.each(function(d){

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
