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
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));



app.get('/loadPhotos', (req, res) => {

  async function processLineByLine() {

    const fileStream = fs.createReadStream('./DATAIMPORT/photos.csv');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var i = 0;
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      var raw = `id,style_id,url,thumbnail_url
      ${line}`;
      var object = csv.toObjects(raw)[0];
      await photo.save(object)
      i++;
      if(i % 1000 === 0) {
        console.log('Photos saved', i);
      }
    }
    console.log('loaded all photos');
  }
  processLineByLine();
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
