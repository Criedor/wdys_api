# wdys_api

/////////////API calls:\\\\\\\\\\\\\\\

Overview:
->Webversion login
    post '/login'
    body: email
          password
  
    returns:  Errorcode 1 //wrong password
              or
              Errorcode 2 //wrong email
              or
              setheader x-token
              token, user_id, displayname, role
            
            
            
->Webversion signup
    post /signup'
    body: email
          password
          displayname
          
    returns:  bcrypt error
              or
              Errorcode 2 // email in use
              or
              setheader x-token
              token, user_id, displayname, role
  

->Initial data set onload of the web dashboard
    post /initial
    body: owner_id        //is ==user_id
    
    returns:  "errorcode": "No languages found"
              or
              "errorcode": "No projects found."
              or
              langs*, projects**                             // *a collection of all defined langs for translation 
                                                             // ** a set of all existing projects the user owns
    
->Creates a new project for a user
     post /projects/create
     body:  projectname
            langs
            baselang
            deadline
            owner_id                                         // owner_id = user_id
            
     returns:   'errorcode': 'Project creation failed'
                or
                project
                
->Load specific project of a user                
    post  /projects/:project_id
    body: user_id
    
    returns:  "errorcode": "Could not load requested project", "project_id": XXXXX
              or
              project, pages*                                 //
    
->Applies changes to a specific project of a TM (projectname, deadline, langs). If a lang is added to the project it automatically creates a new translationpage for the added lang. 
    post  /projects/:project_id/update
    body: user_id
          projectname
          langs
          deadline
          
    returns:  "errorcode": "No projects found."
              or
              "errorcode": "Could not create new pages"
              or
              "project updated"
              

->Extension creates a base page snapshot
    post  /projects/:project_id/snapshot
    body: pagename
          description
          page_url
          base_lang
          base_project_id
          innerHTML
          
    returns:  'errorcode': 'Page creation failed'
              or
              "Page successfully created."    
  
  
->On initial load of the extension by a TM he gets all his projects and the related base pages 
    post  /projects/extensions/initial
    body: owner_id              //is = user_id 
          
    returns:  "errorcode": "No related pages found"
              or
              "errorcode": "No projects found."
              or
              projects, basepages       
      
->On initial load of the extension by a TR he gets all his translation pages and the related projects    
    post    /translators/extension/initial
    body:   translator_id              //is = user_id    
          
    returns:  "errorcode": "No related pages found"
              or
              "errorcode": "No projects found."
              or
              projects, translationpages
              
->A TR can load a specific translationpage and the related basepage              
    post    /translators/extension/getpage
    body:   translator_id               //is = user_id    
            pagename
          
    returns:  "errorcode": "Could not load requested basepage"
              or
              "errorcode": "Could not load requested page"
              or
              translationpage, basepage
              
              
->Saves a snapshot of a specific page a translator worked on              
    post    /translators/extension/sendpage'
    body:   translator_id               //is = user_id    
            pagename
            innerHTML
          
    returns:  "errorcode": "Could not save page"
              or
              "page saved"    
              
              
              




/////////////DB MODELS SCHEMA\\\\\\\\\\\\\\\
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



var ProjectsSchema = new Schema(
  {
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
