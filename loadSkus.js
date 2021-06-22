const { readFile } = require('fs/promises');
const express = require("express");
const bodyParser = require("body-parser");
const product = require('./database/product.js');
const style = require('./database/style.js');
const sku = require('./database/sku.js');
const feature = require('./database/feature.js');
const photo = require('./database/photo.js');
const csv = require('jquery-csv');
const readline = require('readline');
const fs = require('fs');

const relationship = require('./database/relationship.js');
// const productSql = require('./sql/product.js');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));



app.get('/loadSkus', (req, res) => {

  async function processLineByLine() {

    const fileStream = fs.createReadStream('./DATAIMPORT/skus.csv');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var i = 0;
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      var raw = `sku,style_id,size,quantity
      ${line}`;
      var object = csv.toObjects(raw)[0];
      await sku.save(object)
      i++;
      if(i % 1000 === 0) {
        console.log('Skus saved', i);
      }
    }
  }
  processLineByLine();
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
