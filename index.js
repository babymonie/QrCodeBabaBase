const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const randomUid = require("random-uid");
const qr = require("qrcode");
const fetch = require("node-fetch");
var baseurl = "https://domaintester.loca.lt";
var path = require('path');
app.use(express.static(path.resolve('./public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/api/v1/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/v1/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(`./assets/data.json`);
  const dataJson = JSON.parse(data);
  const dataInfo = dataJson.find((item) => item.id === id);
  if (dataInfo) {
    res.json({
      message: "Success",
      error: false,
      data: dataInfo,
    });
  } else {
    res.json({
      message: "Data not found",
      error: true,
    });
  }
});
app.get("/api/v1/getqr/:id", (req, res) => {
  var id = req.params.id;
  qr.toDataURL(baseurl + "/api/v1/" + id, function (err, url) {
    res.send(url);
  });
});
function GetQr(id) {
  const response = fetch(`${baseurl}/api/v1/getqr/${id}`);
  return response.then((res) => res.text());
}
app.get("/test/:id", (req, res) => {
  var id = req.params.id;
  GetQr(id).then((data) => {
    res.send(data);
  });
});
app.post("/api/v1/create", async (req, res) => {
  const body = req.body;
  if ((body.name && body.cost && body.description, body.image, body.category)) {
    var data = fs.readFileSync("./assets/data.json");
    var ui = randomUid();
    var code = await GetQr(ui).then((v2) => {
      return v2;
    });
    var dataJson = JSON.parse(data);
    dataJson.push({
      id: ui,
      qrcode: code.toString(),
      name: body.name,
      cost: body.cost,
      color: body.color || "",
      description: body.description,
      image: body.image,
      category: body.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    fs.writeFileSync("./assets/data.json", JSON.stringify(dataJson));
    res.json({
      message: "Success",
      error: false,
      data: dataJson,
    });
  } else {
    res.json({
      message: "Data not found",
      error: true,
    });
  }
});
app.post("/api/v1/update/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  if ((body.name && body.cost && body.description, body.image, body.category)) {
    var data = fs.readFileSync("./assets/data.json");
    var dataJson = JSON.parse(data);
    var dataInfo = dataJson.find((item) => item.id === id);
    if (dataInfo) {
      dataInfo.name = body.name;
      dataInfo.cost = body.cost;
      dataInfo.color = body.color || "";
      dataInfo.description = body.description;
      dataInfo.image = body.image;
      dataInfo.category = body.category;
      dataInfo.updatedAt = new Date();
      fs.writeFileSync("./assets/data.json", JSON.stringify(dataJson));
      res.json({
        message: "Success",
        error: false,
        data: dataInfo,
      });
    } else {
      res.json({
        message: "Data not found",
        error: true,
      });
    }
  } else {
    res.json({
      message: "Data not found",
      error: true,
    });
  }
});
app.post("/api/v1/delete/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  if ((body.name && body.cost && body.description, body.image, body.category)) {
    var data = fs.readFileSync("./assets/data.json");
    var dataJson = JSON.parse(data);
    var dataInfo = dataJson.find((item) => item.id === id);
    if (dataInfo) {
      dataJson.splice(dataJson.indexOf(dataInfo), 1);
      fs.writeFileSync("./assets/data.json", JSON.stringify(dataJson));
      res.json({
        message: "Success",
        error: false,
        data: dataInfo,
      });
    } else {
      res.json({
        message: "Data not found",
        error: true,
      });
    }
  } else {
    res.json({
      message: "Data not found",
      error: true,
    });
  }
});
app.get("/api/v1/getall", (req, res) => {
  var data = fs.readFileSync("./assets/data.json");
  var dataJson = JSON.parse(data);
  res.json({ 
    message: "Success",
    error: false, 
    data: dataJson,
  });
});
app.get("/api/v1/year", (req, res) => {
  var data = fs.readFileSync("./assets/data.json");
  var dataJson = JSON.parse(data);
  var dataInfo = dataJson.map((item) => item.createdAt);
  var dataYear = dataInfo.map((item) => item.getFullYear());
  var dataYearUnique = [...new Set(dataYear)];
  res.json({
    message: "Success",
    error: false,
    data: dataYearUnique,
  });
});
app.get("/api/v1/month", (req, res) => {
  var data = fs.readFileSync("./assets/data.json");
  var dataJson = JSON.parse(data);
  var dataInfo = dataJson.map((item) => item.createdAt);
  var dataMonth = dataInfo.map((item) => item.getMonth());
  var dataMonthUnique = [...new Set(dataMonth)];
  res.json({
    message: "Success",
    error: false,
    data: dataMonthUnique,
  });
});
app.get("/api/v1/day", (req, res) => {
  var data = fs.readFileSync("./assets/data.json");
  var dataJson = JSON.parse(data);
  var dataInfo = dataJson.map((item) => item.createdAt);
  var dataDay = dataInfo.map((item) => item.getDate());
  var dataDayUnique = [...new Set(dataDay)];
  res.json({
    message: "Success",
    error: false,
    data: dataDayUnique,
  });
});
app.listen(80, () => {
  console.log("Server is running on port 80");
});
