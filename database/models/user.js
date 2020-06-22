var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    // TO DO
  },
  {collection: 'user'}
);

//Export model
module.exports = mongoose.model('User', UserSchema);