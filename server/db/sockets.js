var db      = require("./proxy"); 
var db      = require("./proxy"); 
var faecher = require("./faecher"); 
var odt     = require("../odt/odt");

var registry = []

var toResponse = function(err,data,query) {
    
    var cnt,verb,resp = {}; 
    
    resp.query = {};
    resp.query.text = query.text;
    resp.query.values = query.values;
    
    if (err) { resp.state = "error"
        resp.text = err.message; 
        resp.data = null; 
        resp.error = err; 
        }
    else {
        cnt = data.rowCount; 
        switch (data.command) {
            case "SELECT" : verb = "ausgewählt"; break; 
            case "UPDATE" : verb = "geändert"; break;    
            case "DELETE" : verb = "gelöscht"; break;
            case "INSERT" : verb = "eingefügt"; break; 
            default : verb = data.command;      
        }
        
        if (cnt === 0) {
            resp.text = "0 Datensätze " + verb; 
            resp.state = "warning"; 
            resp.data = []; 
            }
        else {
            if (cnt === 1) resp.text = "1 Datensatz " + verb; 
            else resp.text = cnt + " Datensätze " + verb;
            resp.state = "success"; 
            resp.data = data.rows; 
        }

    }    
    //console.log(resp); 
    return resp; 
}

var registerQuery = function(socket,client,command,queryFn) 
{

    socket.on(command,function(para) {
        console.log("%s.on : ",command); 
        //console.log(para); 
        q = queryFn(para);
        qt = q.toQuery();
        //console.log(qt);
        client.query(qt,function(err,data) {
            socket.emit(command,toResponse(err,data,qt)); 
            }); 
        }); 
}

var registerBatch = function(socket,client,command,batch) 
{

    socket.on(command,function(param) {
        console.log("%s.on : ",command); 
        
        var queries = []; 
        var buff = {};
        var resp = {};
        
        for (i = 0; i < batch.length; i++) {
            buff = {};
            buff.queryFn = batch[i];
            buff.param = param[i]; 
            queries.push(buff);

            }
 
       db.runBatch(client,queries,function(err) {
            
            resp.query = {};
            resp.query.text = "batch"
            resp.query.values = param;
            if (err) {
                resp.state = "error";
                resp.text = err.message; 
                resp.error = err; 
                }
            else {
                resp.state = "success";
                resp.text = "Auftrag durchgeführt" 
                resp.error = null; 
            }
            socket.emit(command,resp); 
        });
    }); 
}

var registerPrintJob = function(socket,command,job) 
{

    socket.on(command,function(para) {
        console.log("%s.on : ",command); 
        job.values = para; 
        console.log(job); 
        odt.printJob(job,function(res) {
            socket.emit(command,res.toData());
        })
    })
}

var registerQueries = function(socket,client,config) {
    
    var i,cf; 
    for( i = 0; i < config.length; i++) {
        cf = config[i]; 
        registerQuery(socket,client,cf.command,cf.fn); 
    }
}

var registerBatches = function(socket,client,config) {
    
    var i,cf; 
    for( i = 0; i < config.length; i++) {
        cf = config[i]; 
        registerQuery(socket,client,cf.command,cf.batch); 
    }
}

var registerOtm = function(socket,client,command,obj) {
    
    socket.on(command,function(param) {
        
        faecher.oneToMany(client,obj,param,function(err,data) {
            var resp = {};
            if (err) { 
                resp.state = "error"
                resp.text = err.message; 
                resp.data = null; 
                resp.error = err; 
                }
             else { 
                resp.state = "success";
                resp.text = "Auftrag durchgeführt"; 
                resp.data = data; 
                resp.error = null; 
             }
            socket.emit(command,resp); 
        })
    })
} 


var register = function(socket,typ,command,config,client) {
    
    switch(typ) {
        
        case "query" : registerQuery(socket,client,command,config); break; 
        case "print" : registerPrintJob(socket,command,config); break;  
        case "batch" : registerBatch(socket,client,command,config); break; 
        default : console.error("unknown type [%s] for command [%s]");     
   
        
    }
    
}


module.exports =  { 
 
    registerQuery       : registerQuery,
    registerQueries     : registerQueries,
    registerPrintJob    : registerPrintJob,
    registerBatch       : registerBatch,
    registerBatches     : registerBatches,
    registerOneToMany   : registerOtm
    
}
