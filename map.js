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
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("display", "block");


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
                .attr("d", path)
                .style("fill","cccccc")
                .style("stroke", "white");

            //fill the drop down boxes for states
            fillStateSelectionDropdowns(json.features);

            //set up circles for the different locations
            svg.selectAll("circle")
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
            d3.selectAll(".category_checkbox")
                .on("change", function() {
                    var checkboxValue = this.value;
                    var points = svg.selectAll("circle")
                        .filter(function(d) {
                            return d.category == checkboxValue;
                        });

                    //display only those points that have been ticked
                    if(this.checked)
                    {
                        //checked gender boxes to get the current picked genders
                        var checkedGenders = d3.selectAll(".gender_checkbox")
                            .filter(function(){
                                return this.checked;
                            });

                        checkedGenders.each(function(){
                            var checkboxGender = this.value;
                            //filter to return points that satisfy the picked gender
                            var tempPoints = points.filter(function(point){
                                return point.gender == checkboxGender;
                            });
                            tempPoints.style("display", "inline");
                        });
                    }
                    else
                    {
                        points.style("display", "none");
                    }
                });

            //adding listener to each gender checkbox
            d3.selectAll(".gender_checkbox")
                .on("change", function(){
                    var checkboxValue = this.value;
                    var points = svg.selectAll("circle")
                        .filter(function(d){
                            return d.gender == checkboxValue;
                        });
                    //display only those points that have been ticked
                    if(this.checked)
                    {
                        //checked category boxes to get the current picked categories
                        var checkedCategories = d3.selectAll(".category_checkbox")
                            .filter(function(){
                                return this.checked;
                            });

                        checkedCategories.each(function(){
                            var checkboxCategory = this.value;
                            //filter to return points that satisfy the picked categories
                            var tempPoints = points.filter(function(point){
                                return point.category == checkboxCategory;
                            });
                            tempPoints.style("display", "inline");
                        });
                        //points.style("display", "inline");
                    }
                    else
                    {
                        points.style("display", "none");
                    }
                });
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
 * Function called when the drop down selection of state changes
 */
function stateSelectionChanged() {
    //var selectedValue = d3.event.target.value;

    // get the current selected states from both drop down boxes
    var selected_state_1 = d3.select("#state_1").node().value;
    var selected_state_2 = d3.select("#state_2").node().value;

    //console.log(d3.select("#state_1").node().value);
    //console.log(d3.select("#state_2").node().value);

    paths = d3.selectAll("path")
        .style("fill", "cccccc");

    paths = paths.filter(function(d){
        var state_name = d.properties.name;
        //console.log(d3.select(this).style("fill"));

        return ((selected_state_1 == state_name) || (selected_state_2 == state_name));
    });

    paths.style("fill", "khaki");

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
