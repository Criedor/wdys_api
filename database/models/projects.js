var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectsSchema = new Schema(
  {
    //project_id replaced by mongoose "_id"
    projectname: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 3, 
      maxlength: 100,
      required: true,
      unique: true
    },
    owner_id: { 
      type: String, 
      required: true, 
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