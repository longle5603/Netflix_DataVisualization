function drawScene2(data) {
    const moviesData = processData(data, "Movie");
    const tvShowsData = processData(data, "TV Show");

    const svgMovies = drawChart("#chartContainerMovies", moviesData, "Movies");
    const svgTVShows = drawChart("#chartContainerTVShows", tvShowsData, "TV Shows");

    const toggleButton = document.getElementById("toggleButton");
    let isMoviesChartVisible = true;

    // Set initial opacity for the charts
    document.getElementById("chartContainerMovies").style.opacity = 1;
    document.getElementById("chartContainerTVShows").style.opacity = 0;

    toggleButton.addEventListener("click", () => {
        if (isMoviesChartVisible) {
            document.getElementById("chartContainerMovies").style.opacity = 0;
            setTimeout(() => {
                document.getElementById("chartContainerMovies").style.display = "none";
                document.getElementById("chartContainerTVShows").style.display = "block";
                document.getElementById("chartContainerTVShows").style.opacity = 1;
                toggleButton.textContent = "Movies Chart";
            }, 500); // Match the duration of the transition
        } else {
            document.getElementById("chartContainerTVShows").style.opacity = 0;
            setTimeout(() => {
                document.getElementById("chartContainerTVShows").style.display = "none";
                document.getElementById("chartContainerMovies").style.display = "block";
                document.getElementById("chartContainerMovies").style.opacity = 1;
                toggleButton.textContent = "TV Shows Chart";
            }, 500); // Match the duration of the transition
        }
        isMoviesChartVisible = !isMoviesChartVisible;
    });
}

function drawChart(container, data, title) {
    const svg = d3.select(container).append("svg")
        .attr("width", 800)
        .attr("height", 500);

    const width = 800, height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 150 };  // Increase left margin to 150

    const categories = data.map(d => d.category);
    const maxValue = d3.max(data, d => d.value);

    const yScale = d3.scaleBand()
        .domain(categories)
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
        .text("");

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(d.category))
        .attr("x", xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("width", 0)
        .attr("fill", "#b20710")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                   .text(`${d.category}: ${d.value}`);
            d3.select(this).attr("fill", "#d9534f");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("fill", "#b20710");
        })
        .transition()
        .duration(1000)
        .attr("width", d => xScale(d.value) - margin.left);

    svg.selectAll("text.bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("y", d => yScale(d.category) + yScale.bandwidth() / 2)
        .attr("x", xScale(0))
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("fill", "white")
        .transition()
        .duration(1000)
        .attr("x", d => xScale(d.value) + 5)
        .attr("y", d => yScale(d.category) + yScale.bandwidth() / 2 + 4)
        .text(d => d.value);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "20px")
        .text(`Top 10 Genres for ${title}`);

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2-60)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("fill", "white")
        .style("font-size", "18px")
        .text("Genre");

    svg.append("text")
        .attr("x", width - margin.right / 2)
        .attr("y", height - margin.bottom / 2)
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .style("font-size", "15px")
        .text("COUNT");

    return svg;
}

function processData(data, type) {
    const filteredData = data.filter(d => d.type === type);

    const categoryCount = {};
    filteredData.forEach(d => {
        d.listed_in.split(', ').forEach(category => {
            if (categoryCount[category]) {
                categoryCount[category]++;
            } else {
                categoryCount[category] = 1;
            }
        });
    });

    const sortedCategories = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a]);
    const topCategories = sortedCategories.slice(0, 10);

    return topCategories.map(category => ({ category, value: categoryCount[category] }));
}

d3.csv('resources/data/netflix_titles.csv').then(data => {
    drawScene2(data);
});
