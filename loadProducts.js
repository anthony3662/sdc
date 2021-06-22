const { readFile } = require('fs/promises');
const express = require("express");
const bodyParser = require("body-parser");
const product = require('./database/product.js');
const style = require('./database/style.js');
const sku = require('./database/sku.js');
const feature = require('./database/feature.js');
const photo = require('./database/photo.js');
const csv = require('jquery-csv');
const relationship = require('./database/relationship.js');
// const productSql = require('./sql/product.js');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));



app.get('/loadProducts', (req, res) => {

  var readPromise = readFile('./DATAIMPORT/product.csv', 'utf8')
  .then(async function(raw) {
    var array = csv.toObjects(raw);
    console.log('read products complete');
    for (var i = 0; i < array.length; i++) {
      if(i % 1000 === 0) {
        console.log('products saved:', i);
      }
      await product.save(array[i]);
    }
    console.log('write products complete');

  });
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
