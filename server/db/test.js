var async = require("async"); 

var obj = {
    
    eins : function (callback) { callback(null,"eins"); },
    unter : function (callback) { callback(null,"unter"); }
}

var a = async.series(obj,function(err,results) { 
    console.log ("ergebnis"); 
    console.log(err); 
    console.log(results); 
})
