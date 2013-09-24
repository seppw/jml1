var fs = require('fs'),
    odt = require('odt'),
    template = odt.template
    

var generate = function(config,callback)
{
    var writeStream; 
    
    // check if template exist
    fs.exists(config.template,function(exists) {
        
        if (!exists) { callback({ state : "error", 
            text : "Druckvorlage '"+ config.template +"' existiert nicht" });

            }
        else {
            writeStream  = fs.createWriteStream(config.out);
            
            writeStream.on('error',function(err) {
                callback({ 
                    state : "error", 
                    error : err,
                    text : "Fehler beim Schreiben der Zieldatei '"+ config.out +"'" });
            })

            
            
            template(config.template).apply(config.values)
                .on('error', function(err){ console.log(err) })
                .on('end',function(document){ callback( { error : null, data : document}); })
                .pipe(writeStream)
                //.on('error', function(err){ console.log(err) })
            }
    });
}

var config = {
    
    template    : "test.odt", 
    out         : "out.odt",
    values      : {
            "name": {
              "type": "string",
              "value": "Anita HelleinMy subject"
            }
        }
}


generate(config,function(result) { 
    console.log("%s : %s",result.state,result.text); 
})


