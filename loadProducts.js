const { readFile } = require('fs/promises');

const product = require('./database/product.js');
const style = require('./database/style.js');
const sku = require('./database/sku.js');
const feature = require('./database/feature.js');
const photo = require('./database/photo.js');
const csv = require('jquery-csv');
const relationship = require('./database/relationship.js');

const readline = require('readline');
const fs = require('fs');




module.exports = () => {

  // var readPromise = readFile('./DATAIMPORT/product.csv', 'utf8')
  // .then(async function(raw) {
  //   var array = csv.toObjects(raw);
  //   console.log('read products complete');
  //   for (var i = 0; i < array.length; i++) {
  //     if(i % 1000 === 0) {
  //       console.log('products saved:', i);
  //     }
  //     await product.save(array[i]);
  //   }
  //   console.log('write products complete');

  // });
  async function processLineByLine() {

    const fileStream = fs.createReadStream('./DATAIMPORT/product.csv');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var i = 0;
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      var raw = `_id,name,slogan,description,category,default_price
${line}`;
      var object = csv.toObjects(raw)[0];
      await product.save(object)
      i++;
      if(i % 1000 === 0) {
        console.log('Products saved', i);
      }
    }
    console.log('loaded all products');
  }
  processLineByLine();

};

