const axios = require("axios");

const width = 500;
const height = width;

const dataInput = [];

axios
  .get(
    "https://edmtrain.com/api/events?festivalInd=true&client=d1d30f63-079d-4607-840c-a39670f1500e"
  )
  .then((res) => {
    let recvData;
    let temObj;
    // console.log(res.data);
    recvData = res.data.data;
    // console.log(recvData);

    temObj = recvData.reduce((total, curr) => {
      total[curr.venue.state]
        ? total[curr.venue.state]++
        : (total[curr.venue.state] = 1);
      return total;
    }, {});
    // console.log(temObj);

    for (let state in temObj) {
      if (state == "null") {
        state = "Virtual";
        dataInput.push({ state: state, numOfEvents: temObj[null] });
      } else {
        dataInput.push({ state: state, numOfEvents: temObj[state] });
      }
    }
    console.log(dataInput);
  })
  .catch((err) => console.log(err))
  .then(() => {
    const color = d3.scaleOrdinal(
      dataInput.map((d) => d.state),
      d3.schemeCategory10
    );

    const pack = (data) => {
      return d3
        .pack()
        .size([width - 2, height - 2])
        .padding(3)(d3.hierarchy({ children: data }).sum((d) => d.numOfEvents));
    };

    const root = pack(dataInput);

    console.log(root);

    // ---------- Svg 1 ----------
    const svg1 = d3
      .select(".container")
      .append("svg")
      // .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

    const bubbleGroup1 = svg1.append("g");

    const leaf1 = bubbleGroup1
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    leaf1
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(d.data.state));

    leaf1
      .append("text")
      .attr("x", 0)
      .attr("y", 4)
      .text((d) => d.data.state);

    const title1 = svg1
      .append("g")
      .attr("transform", `translate(${width / 2}, 30)`)
      .append("text")
      .text("Static")
      .attr("class", "title")
      .attr("font-size", 30);;

    // ---------- Svg 2 ----------

    const svg2 = d3
      .select(".container")
      .append("svg")
      // .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

    const bubbleGroup2 = svg2.append("g");

    const leaf2 = bubbleGroup2.selectAll("g").data(root.leaves()).join("g");

    leaf2
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(d.data.state));

    leaf2
      .append("text")
      .attr("x", 0)
      .attr("y", 4)
      .text((d) => d.data.state);

    const ticked = () => {
      leaf2.attr("transform", (d) => {
        return `translate(${d.x},${d.y})`;
      });
    };

    const simulation = d3
      .forceSimulation(root.leaves())
      .force("charge", d3.forceManyBody().strength(100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide((d) => d.r + 2)
      )
      .on("tick", ticked);

    const dragstarted = (d) => {
      simulation.alphaTarget(0.3).restart();
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    leaf2.call(drag);

    const title2 = svg2
      .append("g")
      .attr("transform", `translate(${width / 2}, 30)`)
      .append("text")
      .text("Dynamic")
      .attr("class", "title")
      .attr("font-size", 30);
  });

// ---------- Request token from Spotify ----------

// var clientId = "4f6c8432d8f54cf9ac2c05103a54df36";
// var clientSecret = "b28c1624650f460fa11895049536367e";
// var encodedData = Buffer.from(clientId + ":" + clientSecret).toString("base64");
// var authorizationHeaderString = "Authorization: Basic " + encodedData;
// var accessToken;

// console.log(encodedData);

// d3.request("https://accounts.spotify.com/api/token")
//   .header("Authorization", "Basic " + encodedData)
//   .header("Content-type", "application/x-www-form-urlencoded")
//   .post("grant_type=client_credentials", (data) => {
//     accessToken = JSON.parse(data.response).access_token;
//     console.log(accessToken);
//   })

// d3.request("https://api.spotify.com/v1/recommendations/available-genre-seeds")
//   .header("Authorization", "Bearer " + accessToken)
//   .header("Content-type", "application/json")
//   .get((error, data) => {
//     if (error) console.log(error);
//     console.log(data);
//   });

// ---------- Request token from Spotify ----------
