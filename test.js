const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const product = require('./database/product.js');
const style = require('./database/style.js');
const sku = require('./database/sku.js');
const feature = require('./database/feature.js');
const photo = require('./database/photo.js');
const relationship = require('./database/relationship.js');
// const productSql = require('./sql/product.js');
const app = express();
const PORT = process.env.PORT || 3009;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get('/test', (req, res) => {
  var results = [0,0]; //success,error
  var repeater = setInterval(() => {
    var random = Math.floor(Math.random() * 1000000) + 1;
    axios.get(`http://127.0.0.1:3000/products/${random}/styles`)
    .then((response) => {
      // console.log(response.data)
      results[0] += 1;
    })
    .catch((err) => {
      // console.log(err);
      results[1] += 1;
    });
  }, 5);
  setTimeout(() => {
    clearInterval(repeater);
    setTimeout(() => {
      res.json(results);
    }, 50);

  }, 2500);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
