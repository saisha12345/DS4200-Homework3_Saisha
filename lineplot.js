// Load the CSV file
d3.csv("SocialMediaTime.csv").then(function(data) {

    // Convert data types
    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;  // Convert AvgLikes to numeric
    });

    // Set up SVG canvas
    const width = 900, height = 500, margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const svg = d3.select("#lineplot")
                  .attr("width", width)
                  .attr("height", height);

    // Define scales
    const xScale = d3.scaleBand()
                     .domain(data.map(d => d.Date))
                     .range([margin.left, width - margin.right])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.AvgLikes)])
                     .range([height - margin.bottom, margin.top]);

    // Add X-axis
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("transform", "rotate(-25)");  // Rotate labels for readability

    // Add Y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yScale));

    // Line generator
    const line = d3.line()
                   .x(d => xScale(d.Date) + xScale.bandwidth() / 2)
                   .y(d => yScale(d.AvgLikes))
                   .curve(d3.curveNatural); // Smooth the curve

    // Draw the line
    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("d", line);
});
