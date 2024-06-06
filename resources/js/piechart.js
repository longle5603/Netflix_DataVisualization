// Kích thước SVG và bán kính của biểu đồ tròn
const widthPie = 500;
const heightPie = 500;
const radius = Math.min(widthPie, heightPie) / 2;

// Chọn phần tử SVG và thiết lập thuộc tính chiều rộng và chiều cao
const svgPie = d3.select("#piechart").html("")
  .append("svg")
  .attr("width", widthPie+500)
  .attr("height", heightPie + 300)
  .append("g")
  .attr("transform", "translate(" + 250 + "," + (350) + ")");

  svgPie.append("text")
  .attr("x", 0)
  .attr("y", -300) // Điều chỉnh vị trí của tiêu đề
  .attr("text-anchor", "middle")
  .style("font-size", "25px")
  .style("font-weight", "bold")
  .attr("fill", "white")
  .text("Total Movies & TV Shows on Netflix");


// Dữ liệu Movies và TV shows
d3.csv("resources/data/netflix_titles.csv")
  .then(function (data) {
    const totalMovies = data.filter(d => d.type === "Movie").length;
    const totalTVShows = data.filter(d => d.type === "TV Show").length;
    const total = totalMovies + totalTVShows;

    const moviesPercentage = (totalMovies / total) * 100;
    const tvShowsPercentage = (totalTVShows / total) * 100;

    const pieData = [
      { category: "Movies", percent: moviesPercentage },
      { category: "TV Shows", percent: tvShowsPercentage }
    ];

    draw_pie(pieData);
  })
  .catch(function (error) {
    console.log(error);
  });

function draw_pie(data) {
  // Màu sắc cho các cung của biểu đồ tròn
  const color = d3.scaleOrdinal(['#f75151', '#b20710']);

  // Tạo hàm pie để chuyển đổi dữ liệu thành các cung của biểu đồ tròn
  var pie = d3.pie()
    .value(function(d) { return d.percent });

  // Tạo hàm arc để vẽ các cung của biểu đồ tròn
  const path = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Chọn tất cả các cung của biểu đồ tròn và áp dụng dữ liệu vào
  const arc = svgPie.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Vẽ các cung của biểu đồ tròn và thêm màu sắc tương ứng
  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.category) });

  
  // Hiển thị phần trăm cho mỗi cung
  arc.append("text")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .text(function(d) { return d.data.category + " (" + d.data.percent.toFixed(1) + "%)"; });
}