const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: [ true, 'must have a name']
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  role: {
    type: String,
    default: 'domestique'
  },
  nationality: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    min: 50,
    max: 250
  },
  weight: {
    type: Number,
    min: 30,
    max: 200
  }
}
, {
    // schema level options here
});

module.exports = mongoose.model('Rider', schema);