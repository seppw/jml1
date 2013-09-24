// try batch jobs with async
var sql     = require("sql"); 
var pg      = require("pg");
var async   = require("async"); 
var _       = require("lodash");

var studiumModel = {
    schema  : "studium",
    name    : "studium",
    columns : ["id","zweig_id","hauptfach_id"]
};

var hauptfachModel = {
    schema  : "studium",
    name    : "hauptfach",
    columns : ["id","name","kurzname","label"]
};

studium     = sql.define(studiumModel);  
hauptfach   = sql.define(hauptfachModel);



//async.eachSeries(arr, iterator, callback)

var iterator = function(item,callback) 
{ 
    var q = item.fn(item.param); 
    client.query(q.toQuery(),function(err,data) 
    {  
        console.log(data.rowCount);
        callback(err); 
    })
}

var config = { 
    user : "sepp",
    database : "sepp_db", 
    password : "sepp"
    }


var client = new pg.Client(config); 
client.connect(function(err) { 
    console.log(err); 
}); 

/*
async.eachSeries([{ fn : fn0, param : 123}],iterator,function(err) { 
   if (err) console.log(err);
   else console.log("success");
})
*/
var runBatch = function(client,queries,callback) 
{
    var iterator = function(item,callback) 
    { 
        var q = item.queryFn(item.param); 
        client.query(q.toQuery(),function(err,data) 
        { callback(err); })
    }
    
    async.eachSeries(queries,iterator,function(err) { 
       if (callback) callback(err); 
       else if (err) console.log(err);
            else console.log("Auftrag durchgeführt");
    })
    
}

/* test

var data = [
    { zweig_id : 24482, hauptfach_id : 24468},
    { zweig_id : 24482, hauptfach_id : 24469},
    { zweig_id : 24482, hauptfach_id : 24470},
]

var del = function(id) 
{ 
    return studium.delete().where(studium.zweig_id.equals(id));
}
var ins = function(data) { return studium.insert(data);}

runBatch(client,
    [ { queryFn : del, param : 24482 }, 
    { queryFn : ins, param : data } ]);
    
*/