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
  // var startTime = Date.now();
  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 5;
  var minIndex = (page - 1) * count + 1;
  var maxIndex = minIndex + count;
  product.findAll(minIndex, maxIndex)
    .then((data) => {
      // var endTime = Date.now();
      // console.log('/products time:', endTime - startTime);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//2 to 7 ms
app.get('/products/:product_id', (req, res) => {
  // var startTime = Date.now();
  var pid = req.params.product_id;
  var promises = [];
  promises.push(product.find(pid));
  promises.push(feature.find(pid));
  Promise.all(promises)
  .then((results) => {
    var item = JSON.parse(JSON.stringify(results[0]));
    var featuresArr = results[1];
    item['features'] = featuresArr;
    // var endTime = Date.now();
    // console.log('product detail time:', endTime - startTime);
    res.json(item);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/randomProduct', (req, res) => {
  // var startTime = Date.now();
  var pid = Math.floor(Math.random() * 1000000) + 1;

  var promises = [];
  promises.push(product.find(pid));
  promises.push(feature.find(pid));
  Promise.all(promises)
  .then((results) => {
    var item = JSON.parse(JSON.stringify(results[0]));
    var featuresArr = results[1];
    item['features'] = featuresArr;
    // var endTime = Date.now();
    // console.log('product detail time:', endTime - startTime);
    res.json(item);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});
//10 to 24 ms
app.get('/products/:product_id/deprecatedStyles', (req, res) => {
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

app.get('/products/:product_id/styles', (req, res) => {
  var pid = parseInt(req.params.product_id);
  var results = style.model.aggregate([
    {$match: {product_id: pid}},
    {
      $lookup: {
        from: 'photos',
        localField: 'style_id',
        foreignField: 'style_id',
        as: 'photos'
      }
    },
    {
      $lookup: {
        from: 'skus',
        localField: 'style_id',
        foreignField: 'style_id',
        as: 'skus'
      }
    },
    {
      $project: {
        'photos._id': 0,
        'photos.__v': 0,
        'photos.style_id': 0,
        'skus.style_id': 0,
        'skus._id': 0,
        'skus.__v': 0,
        '_id': 0,
        'product_id': 0
      }
    },
  ]).sort({style_id: 'asc'})
  .then((data) => {
    for (var i = 0; i < data.length; i++) {
      var skus = data[i].skus;
      var skuObj = {};
      for (var j = 0; j < skus.length; j++) {
        skuObj[skus[j].sku] = {
          size: skus[j].size,
          quantity: skus[j].quantity
        };
      }
      data[i].skus = skuObj;
    }
    var output = {
      product_id: pid,
      styles: data
    };
    res.json(output);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});

//3 to 7 ms
app.get('/products/:product_id/related', (req, res) => {
  // var startTime = Date.now();
  var pid = req.params.product_id;
  relationship.find(pid)
  .then((relations) => {
    var output = relations.map((relation) => {
      return relation.related_product_id;
    });
    // var endTime = Date.now();
    // console.log('related time:', endTime - startTime);
    res.json(output);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/deprecatedRandomStyle', (req, res) => {
  // var startTime = Date.now();
  var pid = Math.floor(Math.random() * 1000000) + 1;
  style.find(pid) //Find Styles
  .then((response) => {

    var styles = JSON.parse(JSON.stringify(response)); //make a deep copy. original object seems to be read only? will eventually return

    //these will let us know if our subsequent queries have come in
    photoPromises = [];
    skuPromises = [];

    //for each style find photos and styles
    for (var i = 0; i < styles.length; i++) {

      if (styles[i].sale_price === 'null') {
        styles[i].sale_price = null;
      }
      var sid = styles[i].style_id;

      //make queries for photos and skus for each style
      photoPromises.push(photo.find(sid));
      skuPromises.push(sku.find(sid));
    }
    Promise.all(photoPromises) //wait until the photos are in
    .then((photos) => {
      for (var i = 0; i < styles.length; i++) { //for each style, add photos
        styles[i].photos = photos[i];
      }
    })
    .then(() => {
      Promise.all(skuPromises) //wait until the skus come in
      //first point of failure under high stress - seems the then block is running before the
      //promise results array fully populates
      .then((skus) => {
        // console.log(skus);
        //for each style attach skus
        for (var i = 0; i < styles.length; i++) {
          var skusObject = {};
          var skuArray = skus[i];

          if (!skuArray) { //Logs if the bug occurs
            console.log(pid);
            console.log(skus);
          }

          //properly nest our output
          for (var j = 0; j < skuArray.length; j++) {
            var key = skuArray[j].sku;
            var innerObject = {quantity: skuArray[j].quantity, size: skuArray[j].size};
            skusObject[key] = innerObject;
          }
          styles[i].skus = skusObject; //attach the skus
        }
        var output = { //package our response
          product_id: pid,
          results: styles
        };
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



app.get('/randomStyle', (req, res) => {
  var pid = Math.floor(Math.random() * 1000000) + 1;
  var results = style.model.aggregate([
    {$match: {product_id: pid}},
    {
      $lookup: {
        from: 'photos',
        localField: 'style_id',
        foreignField: 'style_id',
        as: 'photos'
      }
    },
    {
      $lookup: {
        from: 'skus',
        localField: 'style_id',
        foreignField: 'style_id',
        as: 'skus'
      }
    },
    {
      $project: {
        'photos._id': 0,
        'photos.__v': 0,
        'photos.style_id': 0,
        'skus.style_id': 0,
        'skus._id': 0,
        'skus.__v': 0,
        '_id': 0,
        'product_id': 0
      }
    },
  ])
  .then((data) => {
    for (var i = 0; i < data.length; i++) {
      var skus = data[i].skus;
      var skuObj = {};
      for (var j = 0; j < skus.length; j++) {
        skuObj[skus[j].sku] = {
          size: skus[j].size,
          quantity: skus[j].quantity
        };
      }
      data[i].skus = skuObj;
    }
    var output = {
      product_id: pid,
      styles: data
    };
    res.json(output);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});



const init = () => {
  // require('./loadFeatures.js')();
  // require('./loadPhotos.js')();
  // require('./loadProducts.js')();
  // require('./loadRelated.js')();
  // require('./loadSkus.js')();
  // require('./loadStyles.js')();
};

app.listen(PORT, () => {
  // init();
  console.log(`listening on port ${PORT}`);
});

