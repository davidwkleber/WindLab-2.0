var limit = 500;
 var n = 40,
    random = d3.random.normal(0, .2),
   lineData = d3.range(limit).map(random);
   
 // var data=[];
 
var margin = {top: 10, right: 20, bottom: 20, left: 50},
	width = 1050 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
 
var x = d3.scale.linear()
    .domain([0, limit - 1])
    .range([0, width]);
 
var y = d3.scale.linear()
	.domain([1,1500])
   // .domain([d3.min(data, function(d) {return d.value;}), d3.max(data, function(d) {return d.value;})])
    .range([height, 0]);
 
var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });
 
var svg = d3.select("#lineGraphDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"));
 
svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
 
 // Add the text label for the Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", margin.top - (height / 2))
        .attr("dy", ".71em")
		.style("font-size", "16px")
        .style("text-anchor", "end")
        .text("RPM");

var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(lineData)
    .attr("class", "line")
    .attr("d", line);
 
function changeAxis( axisMax ) {
   y.domain([0, axisMax]);
}

function changeYAxisLabel( yLabel ) {
	 // Add the text label for the Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", margin.top - (height / 2))
        .attr("dy", ".71em")
		.style("font-size", "16px")
        .style("text-anchor", "end")
        .text(yLabel);
}
function tick( value, axisMax ) {

 // var y = d3.scale.linear()
  //  .domain([d3.min(data, function(d) {return d.value;}), d3.max(data, function(d) {return d.value;})])
 //   .range([height, 0]);
	
  // push a new data point onto the back
 // data.push(random());

// console.log('tick value: '+value);
// if (value >= 0) {
  
  
  lineData.push(+value);
 
/* this is for dynamic adjustment of y axis
	var ymin = d3.min(data);
	var ymax = d3.max(data);
	var axisMargin = (ymax-ymin)/10;
	var yminAxis = ymin - axisMargin;
	if (yminAxis < 0) yminAxis = 0;

  y.domain([yminAxis, ymax+axisMargin]);
 */
 

 var newsvg = d3.select("#lineGraphDiv").transition();
 
 newsvg.select(".y.axis")
	.duration(50)
	.call(d3.svg.axis().scale(y).orient("left"));
  // redraw the line, and slide it to the left
  path
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(50)
      .ease("linear")
    .attr("transform", "translate(" + x(-1) + ",0)")
      .each("end", 00);
 
  // pop the old data point off the front
  lineData.shift();
 // }
  // console.log("tick value in lineScan: "+value);
 
}