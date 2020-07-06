var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectsSchema = new Schema(
  {
    projectname: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 100,
      required: true,
      unique: true
    },
    owner_id: { 
      type: String, 
      minlength: 3, 
      required: true
    },
    baselang: { 
      type: String, 
      required: true, 
      lowercase: true
    },
    langs: { // Set of languages the project will be translated into
      type: Array, 
      required: true
    },
    deadline: { 
      type: Date      
    }
  },
  { timestamps: true },
  { collection: 'projects'}
);

//Export model
module.exports = mongoose.model('Projects', ProjectsSchema);