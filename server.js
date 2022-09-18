var express = require("express");

var app = express();

var artists = [
  {
    id: 1,
    name: "Metallica",
  },
  {
    id: 2,
    name: "Iron Maiden",
  },
  {
    id: 3,
    name: "Deep Purple",
  },
];

app.get("/artists", function (req, res) {
  res.send(artists);
});

app.get("/artists/:id", function (req, res) {
  const artist = artists.find((a) => a.id === Number(req.params.id));
  console.log(artist);
  res.send(artist);
});

app.get("/", function (req, res) {
  res.send("Hello API");
});

app.listen(3012, function () {
  console.log("API app started");
});
