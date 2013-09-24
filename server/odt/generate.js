var fs = require('fs'),
    odt = require('odt'),
    template = odt.template
    var events = require('events')
    emitter = new events.EventEmitter()
    
var msg = "####";    

var generate = function(config,callback)
{
    var writeStream; 
    
    // check if template exist
    fs.exists(config.template,function(exists) {
        
        if (!exists) { 
            console.log("Druckvorlage '"+ config.template +"' existiert nicht");
            return; 
            }

    
    writeStream  = fs.createWriteStream(config.out);
    writeStream.on('error', function(err){ 
                writeStream.close();     
                    emitter.emit("error",err,"error in writestream"); 
                })
    try            {
    template(config.template)
                .apply(config.values)
                .on('error', function(err){ 
                    emitter.emit("error",err,"error in apply template");

                })
                .on('end',function(document){ callback( { error : null, data : document}); })
                .pipe(writeStream)
                .on('close', function(){ console.log('document written');})
                .on('error', function(err){ 
                    emitter.emit("error",err,"error in pipe");
                })
    }
    catch(e) { console.log(e)}
    })
    
}



var config = {
    
    template    : "test.odt", 
    out         : "out.odt",
    values      : {
            "name": {
              "type": "string",
              "value": "sepp wimmer"
            }
        }
}



generate(config,function(result) { 
    console.log("%s : %s",result.state,result.text); 
})
emitter.on("error",function(err,msg) { console.log("FEHLER : ", msg)})
