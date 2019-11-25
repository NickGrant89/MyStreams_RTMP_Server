// Add this on the top of app.js file
// next to all imports
const node_media_server = require('./media_server');

// Call Moongoose connection
const mongoose = require('mongoose');

const Config = require('./config/database')


mongoose.connect(Config.database,{ useNewUrlParser: true });

// Starting DB connection

let db = mongoose.connection;

db.once('open', function(){
    console.log('MongoDB Live');
    // and call run() method at the end
// file where we start our web server
 
node_media_server.run();

})

db.on('error', function(err){
    console.log(err);

});

