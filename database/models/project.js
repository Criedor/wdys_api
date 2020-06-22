var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema(
  {
    // TO DO
  },
  {collection: 'project'}
);

//Export model
module.exports = mongoose.model('Project', ProjectSchema);