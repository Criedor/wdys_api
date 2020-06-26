var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsersSchema = new Schema(
  {
    password: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 100
    },
    email: { 
      type: String, 
      trim: true, 
      lowercase: true, 
      unique: true, 
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
      required: true, 
    },
    role: { 
      type: Number, 
      required: true, 
      default: 0,
      enum: [0, 1, 2]  // Translationmanager 0 , Translator 1, Developer 2
    },
    displayname: { 
      type: String, 
      required: true, 
      maxlength: 100
    },
    translator_langs: { // Set of languages the user is allowed to translate
      type: Array, 
      required: true
    }, 
    userreference: { // Set of translationmanagers _id the user is connected to and allowed to do translations for
      type: Array, 
      required: true
    }
  },
  { timestamps: true },
  { collection: 'users'}
);

//Export model
module.exports = mongoose.model('Users', UsersSchema);