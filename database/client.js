var mongoose = require('mongoose');
var cors = require('cors');

//Set up default mongoose connection

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to the db'))
        .catch(err => console.error(err))

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports=db