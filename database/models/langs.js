var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LangsSchema = new Schema(
  {
    //ISO 3 Letter CODE
    lang: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 3
    },
    langname: { 
      type: String, 
      trim: true, 
      unique: true, 
      required: true, 
    }
  },
  { timestamps: true },
  { collection: 'langs'}
);

//Export model
module.exports = mongoose.model('Langs', LangsSchema);