// Create SVG
const width = 500;
const height = width;

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Send request to EDMtrain API and turn JSON file

const dataInput = [];

// d3.request(
//   "https://edmtrain.com/api/events?festivalInd=true&client=d1d30f63-079d-4607-840c-a39670f1500e"
// ).get((error, data) => {
  let recvData;
  let temObj;
  if (error) console.log(error);
  recvData = JSON.parse(data.response).data;
  console.log(recvData);
  temObj = recvData.reduce((total, curr) => {
    total[curr.venue.state]
      ? total[curr.venue.state]++
      : (total[curr.venue.state] = 1);
    return total;
  }, {});
  console.log(temObj);
  for (let state in temObj) {
    if (state == "null") {
      state = "Virtual";
      dataInput.push({ state: state, numOfEvents: temObj[null] });
    } else {
      dataInput.push({ state: state, numOfEvents: temObj[state] });
    }
  }
  console.log(dataInput);

  const g = svg
    .selectAll("g")
    .data(dataInput)
    .enter()
    .append("g")
    // .attr("transform", (d, i) => "translate(0,0)");

  g.append("circle")
    .attr("cx", (d, i) => i * 100 + 50)
    .attr("cy", 100)
    .attr("r", (d) => d.numOfEvents * 3);

  g.append("text")
    .attr("x", (d, i) => i * 100 + 40)
    .attr("y", 105)
    .attr("stroke", "#fff")
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .text((d) => d.state);
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
