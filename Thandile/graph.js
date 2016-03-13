function graph(stat){	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 400 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6"]);

	var xAxis = d3.svg.axis()
	    .scale(x0)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg = d3.select("gender").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("state_gender.csv", function(error, data) {
	  if (error) throw error;

	  var genderNames = d3.keys(data[0]).filter(function(key) { return key !== "state"; });

	  data.forEach(function(d) {
	    d.genders = genderNames.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  x0.domain(data.map(function(d) { return d.state === stat ; }));
	  x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]);
	  y.domain([0, d3.max(data, function(d) { return d3.max(d.genders, function(d) { return d.value; }); })]);

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
	      .text("Number of Resolutions");

	  var state = svg.selectAll(".state")
	      .data(data)
	    .enter().append("g")
	      .filter(function(d) { return d.state == stat})
	      .attr("class", "state")
	      //.attr("transform", function(d) { return "translate(" + x0(d.state) + ",0)"; });

	  state.selectAll("rect")
	      .data(function(d) { return d.genders; })
	    .enter().append("rect")
	    //.filter(function(d) { return d.name === "female" })
	      .attr("width", x1.rangeBand())
	      .attr("x", function(d) { return x1(d.name); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .style("fill", function(d) { return color(d.name); });

	  var legend = svg.selectAll(".legend")
	      .data(genderNames.slice().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });
	});
}



function categories(stat) {
	var margin1 = {top: 20, right: 20, bottom: 30, left: 40},
	    width1 = 400 - margin1.left - margin1.right,
	    height1 = 300 - margin1.top - margin1.bottom;

	var x01 = d3.scale.ordinal()
	    .rangeRoundBands([0, width1], .1);

	var x11 = d3.scale.ordinal();

	var y1 = d3.scale.linear()
	    .range([height1, 0]);

	var color1 = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis1 = d3.svg.axis()
	    .scale(x01)
	    .orient("bottom");

	var yAxis1 = d3.svg.axis()
	    .scale(y1)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg1 = d3.select("categories").append("svg")
	    .attr("width", width1 + margin1.left + margin1.right)
	    .attr("height", height1 + margin1.top + margin1.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

	d3.csv("state-cat.csv", function(error, data) {
	  if (error) throw error;

	  var genderNames1 = d3.keys(data[0]).filter(function(key) { return key !== "state"; });

	  data.forEach(function(d) {
	    d.genders1 = genderNames1.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  x01.domain(data.map(function(d) { return d.state == stat; }));
	  x11.domain(genderNames1).rangeRoundBands([0, x01.rangeBand()]);
	  y1.domain([0, d3.max(data, function(d) { return d3.max(d.genders1, function(d) { return d.value; }); })]);

	  svg1.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height1 + ")")
	      .call(xAxis1);

	  svg1.append("g")
	      .attr("class", "y axis")
	      .call(yAxis1)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Number of Resolutions");

	  var state = svg1.selectAll(".state")
	      .data(data)
	    .enter().append("g")
	    .filter(function(d) { return d.state == stat})
	      .attr("class", "state")
	      //.attr("transform", function(d) { return "translate(" + x01(d.state) + ",0)"; });

	  state.selectAll("rect")
	      .data(function(d) { return d.genders1; })
	    .enter().append("rect")
	      .attr("width", x11.rangeBand())
	      .attr("x", function(d) { return x11(d.name); })
	      .attr("y", function(d) { return y1(d.value); })
	      .attr("height", function(d) { return height1 - y1(d.value); })
	      .style("fill", function(d) { return color1(d.name); })
	      .on("click", function(d) { return subcat(d.name);});

	  var legend = svg1.selectAll(".legend")
	      .data(genderNames1.slice().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width1 - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color1);

	  legend.append("text")
	      .attr("x", width1 - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

	});
}

function subcat(category){
	alert(category)
	var margin1 = {top: 20, right: 20, bottom: 30, left: 40},
	    width1 = 400 - margin1.left - margin1.right,
	    height1 = 300 - margin1.top - margin1.bottom;

	var x01 = d3.scale.ordinal()
	    .rangeRoundBands([0, width1], .1);

	var x11 = d3.scale.ordinal();

	var y1 = d3.scale.linear()
	    .range([height1, 0]);

	var color1 = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis1 = d3.svg.axis()
	    .scale(x01)
	    .orient("bottom");

	var yAxis1 = d3.svg.axis()
	    .scale(y1)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg1 = d3.select("subcategories").append("svg")
	    .attr("width", width1 + margin1.left + margin1.right)
	    .attr("height", height1 + margin1.top + margin1.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

	d3.csv("state-cat.csv", function(error, data) {
	  if (error) throw error;

	  var genderNames1 = d3.keys(data[0]).filter(function(key) { return key !== "state"; });

	  data.forEach(function(d) {
	    d.genders1 = genderNames1.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  x01.domain(data.map(function(d) { return d.state; }));
	  x11.domain(genderNames1).rangeRoundBands([0, x01.rangeBand()]);
	  y1.domain([0, d3.max(data, function(d) { return d3.max(d.genders1, function(d) { return d.value; }); })]);

	  svg1.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height1 + ")")
	      .call(xAxis1);

	  svg1.append("g")
	      .attr("class", "y axis")
	      .call(yAxis1)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Number of Resolutions");

	  var state = svg1.selectAll(".state")
	      .data(data)
	    .enter().append("g")
	    //.filter(function(d) { return d.state == stat})
	      .attr("class", "state")
	      //.attr("transform", function(d) { return "translate(" + x01(d.state) + ",0)"; });

	  state.selectAll("rect")
	      .data(function(d) { return d.genders1; })
	    .enter().append("rect")
	      .attr("width", x11.rangeBand())
	      .attr("x", function(d) { return x11(d.name); })
	      .attr("y", function(d) { return y1(d.value); })
	      .attr("height", function(d) { return height1 - y1(d.value); })
	      .style("fill", function(d) { return color1(d.name); })
	      .on("click", function(d) { return subcat(d.name);});

	  var legend = svg1.selectAll(".legend")
	      .data(genderNames1.slice().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width1 - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color1);

	  legend.append("text")
	      .attr("x", width1 - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

	});
}