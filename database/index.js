// const MONGO_USER = 'Heroku';
// const PASSWORD = '0hZkC0OutmdJxv8r';
// const CLUSTER = 'fullstack-review';

//atlas test db
// const uri = `mongodb+srv://Heroku:${PASSWORD}@fullstack-review.maljn.mongodb.net/sdc?retryWrites=true&w=majority`;

//docker db
const uri =  "mongodb://mongo:27017/atelier";

// const uri =  "mongodb://localhost:27017/atelier";


//local test db
// const uri =  "mongodb://localhost/testAtelier";

const mongoose = require('mongoose');
mongoose.connect(uri);
module.exports = mongoose;