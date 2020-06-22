var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PageSchema = new Schema(
  {
    // TO DO
  },
  {collection: 'page'}
);

//Export model
module.exports = mongoose.model('Page', PageSchema)