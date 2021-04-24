function makeResponsive(yaxis) {

    // Define SVG area dimensions
    var svgWidth = 960;
    var svgHeight = 660;

    // Define the chart's margins as an object
    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3.select("#chartdiv")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.select("#chartdiv").append("div").attr("class", "tooltip").style("opacity", 0);

    // Read in code
    d3.csv("Resources/merge_df.csv").then(function(waterData) {
        // console.log(waterData);
        waterData.forEach(function (d) {
            d[yaxis] = +d[yaxis];
            d.safe_water_2017 = +d.safe_water_2017;
        });

        var xScale = d3.scaleLinear()
            .domain([1, d3.max(waterData, d => d.safe_water_2017)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(waterData, d => d[yaxis])])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Create axes labels
        var titleLookup = {"unsafe_water_perct":"Death Rate from Unsafe Water", 
                           "unsafe_sanitation_perct": "Death Rate from Unsafe Sanitation",
                           "no_handwashing_perct":"Death Rate from No Handwashing"};
        
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("data-name", yaxis)
            .text(titleLookup[yaxis]);

        // Add labels    
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("% of Population with Access to Clean Water");

        chartGroup.append('text')
            .attr('transform', `translate(${width / 2}, ${-5})`)
            .attr("class", "axisText")
            .text("Water Death % vs Access to Clean Water");

        var myColor = d3.scaleSequential().domain([1, 10]).interpolator(d3.interpolateViridis);
        var circles = chartGroup.selectAll("circle")
            .data(waterData)
            // .attr("cx", d => xScale(d.safe_water_2017))
            // .attr("cy", d => yLinearScale(d[yaxis]))
            // .attr("r", "10")
            // .attr("fill", function (d) { return myColor(d) })
            // .attr("opacity", ".5");

        circles.enter()
            .append("circle")
            .attr("cx", d => xScale(d.safe_water_2017))
            .attr("cy", d => yLinearScale(d[yaxis]))
            .attr("r", "10")
            .attr("fill", function (d) { return myColor(d) })
            .attr("opacity", ".5")
            .on("click", function (d) {
                console.log(d);
                alert(`Hey! You clicked bar ${d}!`);
            });

        // Add country code
        circles.enter()
            .append("text")
            .text(d => d.code)
            .attr("dx", d => xScale(d.safe_water_2017))
            .attr("dy", d => yLinearScale(d[yaxis]) + 10 / 2.5)
            .attr("font-size", "7")
            .attr("class", "stateText");

        // circles.exit().remove();

        // chartGroups.selectAll("circle").on("click", function (d) {
        //         console.log(d);
        //         // alert(`Hey! You clicked bar ${d[]}!`);
        //     })
        //     // event listener for mouseover
        //     .on("mouseover", function () {
        //         d3.select(this)
        //             .attr("fill", "red");
        //     })
        //     // event listener for mouseout
        //     .on("mouseout", function () {
        //         d3.select(this)
        //             .attr("fill", "green");
        //     });



        // var toolTip = d3.tip()
        //     .attr("class", "tooltip")
        //     .offset([80, -60])
        //     .html(function (d) {
        //         return (code + '%');
        //     });

        // chartGroup.call(toolTip);
        // circlesGroup.on("click", function (data) {
        //     toolTip.show(data);
        // })
        //     .on("mouseout", function (data, index) {
        //         toolTip.hide(data);
        //     });


        // console.log(waterData);

    });

}
function changeY(yaxis) {

}

makeResponsive('no_handwashing_perct');
d3.select("#chartdiv").html("");
makeResponsive('unsafe_sanitation_perct');