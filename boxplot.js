// Load the CSV file
d3.csv("socialMedia.csv").then(function(data) {
    
    // Convert Likes to numeric values
    data.forEach(d => {
        d.Likes = +d.Likes;  // Convert Likes column to numbers
    });

    // Set up SVG canvas
    const width = 900, height = 550, margin = { top: 60, right: 50, bottom: 60, left: 70 };
    const svg = d3.select("#boxplot")
                  .attr("width", width)
                  .attr("height", height);

    // Extract unique platforms
    const platforms = Array.from(new Set(data.map(d => d.Platform)));

    // Set up scales
    const xScale = d3.scaleBand()
                     .domain(platforms)
                     .range([margin.left, width - margin.right])
                     .padding(0.4);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.Likes)])
                     .range([height - margin.bottom, margin.top]);

    // Add X-axis
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .style("font-size", "14px")
       .attr("dy", "0.5em");

    // Add Y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yScale))
       .selectAll("text")
       .style("font-size", "14px");

    // Add Y-axis label
    svg.append("text")
       .attr("text-anchor", "middle")
       .attr("transform", `translate(${margin.left - 50}, ${height / 2}) rotate(-90)`)
       .style("font-size", "16px")
       .style("font-weight", "bold")
       .text("Number of Likes");

    // Add X-axis label
    svg.append("text")
       .attr("text-anchor", "middle")
       .attr("x", width / 2)
       .attr("y", height - 20)
       .style("font-size", "16px")
       .style("font-weight", "bold")
       .text("Social Media Platform");

    // Add Title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", margin.top - 20)
       .attr("text-anchor", "middle")
       .style("font-size", "22px")
       .style("font-weight", "bold")
       .text("Distribution of Likes Across Platforms");

    // Function to calculate quartiles
    function rollupFunction(values) {
        values.sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const min = d3.min(values);
        const max = d3.max(values);
        return { q1, median, q3, min, max };
    }

    // Group data by platform and compute quartiles
    const quartilesByPlatform = d3.rollup(data, v => rollupFunction(v.map(d => d.Likes)), d => d.Platform);

    // Add Boxplot Elements
    quartilesByPlatform.forEach((quartiles, platform) => {
        const x = xScale(platform);
        const boxWidth = xScale.bandwidth();

        // Vertical Line (Min to Max)
        svg.append("line")
           .attr("x1", x + boxWidth / 2)
           .attr("x2", x + boxWidth / 2)
           .attr("y1", yScale(quartiles.min))
           .attr("y2", yScale(quartiles.max))
           .attr("stroke", "black")
           .attr("stroke-width", 2);

        // Rectangle (Q1 to Q3)
        svg.append("rect")
           .attr("x", x)
           .attr("y", yScale(quartiles.q3))
           .attr("width", boxWidth)
           .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
           .attr("fill", "#ffcc80")  // Orange color
           .attr("stroke", "black");

        // Median Line
        svg.append("line")
           .attr("x1", x)
           .attr("x2", x + boxWidth)
           .attr("y1", yScale(quartiles.median))
           .attr("y2", yScale(quartiles.median))
           .attr("stroke", "black")
           .attr("stroke-width", 2);
    });
});
