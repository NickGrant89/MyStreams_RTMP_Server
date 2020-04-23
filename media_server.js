const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').rtmp_server;
    
nms = new NodeMediaServer(config);

// Add import at the start of file
let User = require('./models/user');

let Alert = require('./models/alert');

var myInt;

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
   
    User.findOne({'streamkey': stream_key}, (err, user) => {
        //console.log(user);
        if(err){}
        if (!err) {
            if (!user) {
            
                let session = nms.getSession(id);
               
                console.log('Rejected' + ' - ' + id);
                session.reject();
            } 
            if(user.activated == false){
                let session = nms.getSession(id);
               
                console.log('Rejected' + ' - ' + id);
                session.reject();
            }
            else {
                
                let session = nms.getSession(id);

                console.log('Appoved' + ' - ' + id);

                // do stuff
                let alert = new Alert();
                alert.user = user._id;
                alert.notification = stream_key + ' - ' + 'Connected'
                alert.datecreated = new Date().toLocaleString();

                console.log(session.ip, " - ", new Date().toLocaleString());

                alert.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                       
                    }
                });
               
                var lastConnected = {
                    lastconnected : session.ip + " - " + new Date().toLocaleString()
                }
                User.updateOne({_id:user._id}, lastConnected, function(err){
                    if(err){
                        console.log(err);
           
                    }
                    else{
                        
                    
                    }
                });
                 myInt = setTimeout(function () {
                    session.reject();
                    console.log('timeout completed'); 
                    var lastConnected = {
                        //activated: false,
                    }
                    User.updateOne({_id:user._id}, lastConnected, function(err){
                        if(err){
                            console.log(err);
               
                        }
                        else{
                            
                        
                        }
                    });
                }, 120000); 
            }
        }
    });
});


nms.on('donePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    User.findOne({'streamkey': stream_key}, (err, user) => {
            //console.log(user);
            if(err){
                console.log(err);
                return;
            }else{
                 // do stuff
                let alert = new Alert();
                alert.user = user._id;
                alert.notification = stream_key + ' - ' + 'Disconnected'
                alert.datecreated = new Date().toLocaleString();
                clearTimeout(myInt);
                alert.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        
                    }
                });
            }
       
    });
  }); 
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;