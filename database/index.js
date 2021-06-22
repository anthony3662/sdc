// const MONGO_USER = 'Heroku';
// const PASSWORD = '0hZkC0OutmdJxv8r';
// const CLUSTER = 'fullstack-review';
// const uri = `mongodb+srv://Heroku:${PASSWORD}@fullstack-review.maljn.mongodb.net/sdc?retryWrites=true&w=majority`;
const uri =  "mongodb://localhost/atelier";
const mongoose = require('mongoose');
mongoose.connect(uri);

module.exports = mongoose;