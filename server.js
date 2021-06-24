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
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

//2 to 7 ms
app.get('/products', (req, res) => {
  var startTime = Date.now();
  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 5;
  var minIndex = (page - 1) * count + 1;
  var maxIndex = minIndex + count;
  product.findAll(minIndex, maxIndex)
    .then((data) => {
      var endTime = Date.now();
      console.log('/products time:', endTime - startTime);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//2 to 7 ms
app.get('/products/:product_id', (req, res) => {
  var startTime = Date.now();
  var pid = req.params.product_id;
  var promises = [];
  promises.push(product.find(pid));
  promises.push(feature.find(pid));
  Promise.all(promises)
  .then((results) => {
    var item = JSON.parse(JSON.stringify(results[0]));
    var featuresArr = results[1];
    item['features'] = featuresArr;
    var endTime = Date.now();
    console.log('product detail time:', endTime - startTime);
    res.json(item);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});
//10 to 24 ms
app.get('/products/:product_id/styles', (req, res) => {
  var startTime = Date.now();
  var pid = req.params.product_id;
  style.find(pid)
  .then((response) => {
    var styles = JSON.parse(JSON.stringify(response));
    photoPromises = [];
    skuPromises = [];
    for (var i = 0; i < styles.length; i++) {
      if (styles[i].sale_price === 'null') {
        styles[i].sale_price = null;
      }
      var sid = styles[i].style_id;
      photoPromises.push(photo.find(sid));
      skuPromises.push(sku.find(sid));
    }
    Promise.all(photoPromises)
    .then((photos) => {
      for (var i = 0; i < styles.length; i++) {
        styles[i].photos = photos[i];
      }
    })
    .then(() => {
      Promise.all(skuPromises)
      //first point of failure under high stress - seems the then block is running before the
      //promise results array fully populates
      .then((skus) => {
        // console.log(skus);
        for (var i = 0; i < styles.length; i++) {
          var skusObject = {};
          var skuArray = skus[i];
          if (!skuArray) {
            console.log(pid);
            console.log(skus);
          }
          for (var j = 0; j < skuArray.length; j++) {
            var key = skuArray[j].sku;
            var innerObject = {quantity: skuArray[j].quantity, size: skuArray[j].size};
            skusObject[key] = innerObject;
          }
          styles[i].skus = skusObject;
        }
        var output = {
          product_id: pid,
          results: styles
        };
        var endTime = Date.now();
        // console.log(pid + ' styles time:', endTime - startTime);
        res.json(output);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
    });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

//3 to 7 ms
app.get('/products/:product_id/related', (req, res) => {
  var startTime = Date.now();
  var pid = req.params.product_id;
  relationship.find(pid)
  .then((relations) => {
    var output = relations.map((relation) => {
      return relation.related_product_id;
    });
    var endTime = Date.now();
    console.log('related time:', endTime - startTime);
    res.json(output);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

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
