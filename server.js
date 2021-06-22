const express = require("express");
const bodyParser = require("body-parser");
const product = require('./database/product.js');
const style = require('./database/style.js');
const sku = require('./database/sku.js');
const feature = require('./database/feature.js');
const photo = require('./database/photo.js');
const relationship = require('./database/relationship.js');
// const productSql = require('./sql/product.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));


app.get('/products', (req, res) => {
  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 5;
  var minIndex = (page - 1) * count + 1;
  var maxIndex = minIndex + count;
  product.findAll(minIndex, maxIndex)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get('/products/:product_id', (req, res) => {
  var pid = req.params.product_id;
  var promises = [];
  promises.push(product.find(pid));
  promises.push(feature.find(pid));
  Promise.all(promises)
  .then((results) => {
    var item = JSON.parse(JSON.stringify(results[0]));
    var featuresArr = results[1];
    item['features'] = featuresArr;
    res.json(item);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });


});

app.get('/products/:product_id/styles', (req, res) => {
  var pid = req.params.product_id;
  style.find(pid)
  .then((styles) => {
    console.log(styles);
    res.sendStatus(200);
  })
})



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
