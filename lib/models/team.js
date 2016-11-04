const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const schema = new Schema({
  team: {
    type: String,
    required: true
  },
  sponsor: {
    type: String,
  },
  country: {
    type: String,
    required: true
  }
}, {
    // schema level options here
});

module.exports = mongoose.model('Team', schema);