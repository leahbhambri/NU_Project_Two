// Code for Chart is Wrapped Inside a Function That Automatically Resizes the Chart
function makeResponsive() {

    // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
    var svgArea = d3.select("body").select("svg");

    // Clear SVG is Not Empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Setup Chart Parameters/Dimensions
    var svgWidth = 980;
    var svgHeight = 600;

    // Set SVG Margins
    var margin = {
        top: 20,
        right: 40,
        bottom: 90,
        left: 100
    };

    // Define Dimensions of the Chart Area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "safe_water_2017";
    var chosenYAxis = "unsafe_water_perct";

    // Function for Updating xScale Upon Click on Axis Label
    function xScale(acsData, chosenXAxis) {
        // Create Scale Functions for the Chart (chosenXAxis)
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
            d3.max(acsData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);
        return xLinearScale;
    }

    // Function for Updating yScale Upon Click on Axis Label
    function yScale(acsData, chosenYAxis) {
        // Create Scale Functions for the Chart (chosenYAxis)
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
            d3.max(acsData, d => d[chosenYAxis]) * 1.2
            ])
            .range([height, 0]);
        return yLinearScale;
    }

    // Function for Updating xAxis Upon Click on Axis Label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }

    // Function for Updating yAxis Upon Click on Axis Label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        return yAxis;
    }

    // Function for Updating Circles Group with a Transition to New Circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }

    // Function for Updating Text Group with a Transition to New Text
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");

        return textGroup;
    }

    // Function for Updating Circles Group with New Tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup, acsData) {

        if (chosenXAxis === "safe_water_2017") {
            var xLabelsGroup = "Percent of Population with Access to Clean Water";

        }

        // Initialize Tool Tip
        var mytooltip = d3.select("#tooltip")
            .attr("class", "tooltip")
        circlesGroup.on("mouseover", function (d, i) {
            console.log(d);
            mytooltip.style("display", "block");
            mytooltip.html(`Country: <strong>${d}</strong>`)
                .style("left", (d3.event.pageX+10) + "px")
                .style("top", (d3.event.pageY+10) + "px")

        })
            .on("mouseout", function () {
                mytooltip.style("display", "none");
            });
        return circlesGroup;
        
        
    }

    // Import Data from the d.csv File & Execute Everything Below
    // d3.json('http://127.0.0.1:5000/api/v1.0/water_data')
    d3.csv("Resources/merge_df.csv")
        .then(function (acsData) {
            console.log(acsData)
            // Format/Parse the Data (Cast as Numbers)
            acsData.forEach(function (d) {
                d.safe_water_2017 = +d.safe_water_2017;
                d.unsafe_water_perct = +d.unsafe_water_perct;
                d.unsafe_sanitation_perct = +d.unsafe_sanitation_perct;
                d.no_handwashing_perct = +d.no_handwashing_perct;
            });

            // Create xLinearScale & yLinearScale Functions for the Chart
            var xLinearScale = xScale(acsData, chosenXAxis);
            var yLinearScale = yScale(acsData, chosenYAxis);

            // Create Axis Functions for the Chart
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            // Append xAxis to the Chart
            var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            // Append yAxis to the Chart
            var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);

            // Create & Append Initial Circles
            var myColor = d3.scaleSequential().domain([1, 10]).interpolator(d3.interpolateViridis);
            var circlesGroup = chartGroup.selectAll("stateCircle")
                .data(acsData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("class", "stateCircle")
                .attr("r", 15)
                .attr("fill", function (d) { return myColor(d) })
                .attr("opacity", ".75");

            // Append Text to Circles
            var textGroup = chartGroup.selectAll("stateText")
                .data(acsData)
                .enter()
                .append("text")
                .attr("x", d => xLinearScale(d[chosenXAxis]))
                .attr("y", d => yLinearScale(d[chosenYAxis])+10/2.5)
                .text(d => (d.code))
                .attr("class", "stateText")
                .attr("font-size", "8px")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            // Create Group for 3 xAxis Labels
            var xLabelsGroupsGroup = chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + 20})`);
            // Append xAxis
            var safe_water_2017Label = xLabelsGroupsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "safe_water_2017") // Value to Grab for Event Listener
                .classed("active", true)
                .text("Percent of Population with Access to Clean Water");


            // Create Group for 3 yAxis Labels
            var yLabelsGroup = chartGroup.append("g")
                .attr("transform", `translate(-25, ${height / 2})`);
            // Append yAxis
            var unsafe_water_perctLabel = yLabelsGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -30)
                .attr("x", 0)
                .attr("value", "unsafe_water_perct")
                .attr("dy", "1em")
                .classed("axis-text", true)
                .classed("active", true)
                .text("Percent of Deaths Attributed to Unsafe Drinking Water");

            var no_handwashing_perctLabel = yLabelsGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("x", 0)
                .attr("value", "no_handwashing_perct")
                .attr("dy", "1em")
                .classed("axis-text", true)
                .classed("inactive", true)
                .text("Percent of Deaths Attributed to No Handwashing Access");

            var unsafe_sanitation_perctLabel = yLabelsGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -70)
                .attr("x", 0)
                .attr("value", "unsafe_sanitation_perct")
                .attr("dy", "1em")
                .classed("axis-text", true)
                .classed("inactive", true)
                .text("Percent of Deaths Attributed to Unsafe Sanitation");

            // updateToolTip Function
            var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup, acsData);

            // xAxis Labels Event Listener
            xLabelsGroupsGroup.selectAll("text")
                .on("click", function () {
                    // Get Value of Selection
                    var value = d3.select(this).attr("value");
                    if (value !== chosenXAxis) {
                        // Replaces chosenXAxis with Value
                        chosenXAxis = value;
                        // Updates xScale for New Data
                        xLinearScale = xScale(acsData, chosenXAxis);
                        // Updates xAxis with Transition
                        xAxis = renderXAxes(xLinearScale, xAxis);
                        // Updates Circles with New Values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        // Updates Text with New Values
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                        // Updates Tooltips with New Information
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup, acsData);
                        // Changes Classes to Change Bold Text
                        if (chosenXAxis === "safe_water_2017") {
                            safe_water_2017Label
                                .classed("active", true)
                                .classed("inactive", false);
                            // safe_water_2017Label
                            //     .classed("active", false)
                            //     .classed("inactive", true);
                            // safe_water_2017Label
                            //     .classed("active", false)
                            //     .classed("inactive", true);
                        }
                    }
                });

            // yAxis Labels Event Listener
            yLabelsGroup.selectAll("text")
                .on("click", function () {
                    // Get Value of Selection
                    var value = d3.select(this).attr("value");
                    if (value !== chosenYAxis) {
                        // Replaces chosenYAxis with Value
                        chosenYAxis = value;
                        // Updates yScale for New Data
                        yLinearScale = yScale(acsData, chosenYAxis);
                        // Updates yAxis with Transition
                        yAxis = renderYAxes(yLinearScale, yAxis);
                        // Updates Circles with New Values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        // Updates Text with New Values
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                        // Updates Tooltips with New Information
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup, acsData);
                        // Changes Classes to Change Bold Text
                        if (chosenYAxis === "unsafe_water_perct") {
                            unsafe_water_perctLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            unsafe_sanitation_perctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            no_handwashing_perctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenYAxis === "unsafe_sanitation_perct") {
                            unsafe_water_perctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            unsafe_sanitation_perctLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            safe_water_2017Label
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            unsafe_water_perctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            unsafe_sanitation_perctLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            no_handwashing_perctLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    }
                });
        });
}
// When Browser Loads, makeResponsive() is Called
makeResponsive();

// When Browser Window is Resized, makeResponsive() is Called
d3.select(window).on("resize", makeResponsive);