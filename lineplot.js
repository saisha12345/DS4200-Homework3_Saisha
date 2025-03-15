// Load the CSV file
d3.csv("SocialMediaTime.csv").then(function(data) {

    // Convert data types
    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;  // Convert AvgLikes to numeric
    });

    // Set up SVG canvas
    const width = 900, height = 500, margin = { top: 50, right: 50, bottom: 100, left: 80 };
    const svg = d3.select("#lineplot")
                  .attr("width", width)
                  .attr("height", height);

    // Define scales
    const xScale = d3.scaleBand()
                     .domain(data.map(d => d.Date))
                     .range([margin.left, width - margin.right])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([400, d3.max(data, d => d.AvgLikes)])  // Adjusted min to 400 for better visualization
                     .range([height - margin.bottom, margin.top]);

    // Add X-axis
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("transform", "rotate(-25)");  // Rotate labels for readability

    // Add X-axis label
    svg.append("text")
       .attr("text-anchor", "middle")
       .attr("x", width / 2)
       .attr("y", height - 40)
       .style("font-size", "16px")
       .style("font-weight", "bold")
       .text("Date");

    // Add Y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yScale));

    // Add Y-axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -height / 2)
       .attr("y", margin.left / 3)
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .style("font-weight", "bold")
       .text("Average Likes");

    // Create the line generator with curveNatural
    const line = d3.line()
        .x(d => xScale(d.Date) + xScale.bandwidth() / 2) // Center the line in the band
        .y(d => yScale(d.AvgLikes))
        .curve(d3.curveNatural);  // Ensuring smooth curve

    // Draw the line
    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("d", line);

    // Add dots for each data point
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d.Date) + xScale.bandwidth() / 2)
       .attr("cy", d => yScale(d.AvgLikes))
       .attr("r", 5)
       .attr("fill", "red")
       .attr("stroke", "black");

});
