var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PagesSchema = new Schema(
  {
    pagename: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 3, 
      maxlength: 100,
      required: true,
      unique: true
    },
    description: { 
      type: String, 
      // minlength: 3, 
      // maxlength: 600
    },
    assigned: { 
      type: Date 
    },
    page_url: { 
      type: String,
      required: true
    },
    base_lang: { 
      type: String, 
      required: true, 
    },
    lang: { // The language the page will be translated into
      type: String, 
    }, 
    base_project_id: { 
      type: String, 
      required: true, 
    },
    base_page_id: { // _id of the base snapshot page
      type: String, 
      default: "base"
    },
    translator_id: { // _id of the assigned translator
      type: String, 
    },
    status: { 
      type: String,
    },
    innerHTML: { 
      type: String, 
      required: true, 
    },
  },
  { timestamps: true },
  { collection: 'pages'}
);

//Export model
module.exports = mongoose.model('Pages', PagesSchema)