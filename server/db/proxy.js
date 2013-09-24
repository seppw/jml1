var sql     = require("sql"); 
var pg      = require("pg");
var async   = require("async"); 
var _       = require("lodash");

var errorFields = ["message", "code", "detail","hint"]; 
var dataFields = ["command", "rowCount", "rows"];

var defaultExecCallback = function(err,data)
{
    if (err) console.log(err)
    else {
        console.log("%s %s",data.command,data.rowCount)
        console.log(data.rows); 
    }
}

var defaultBatchCallback = function(err,data)
{
    if (err) console.log(err)
    else {
        for(prop in data) {
            console.log("%s : %s %s",prop,data[prop].command,data[prop].rowCount)
            console.log(data[prop].rows); 
        }
    }
}

var execute = function(client,query,callback) 
    {
        var q = query.toQuery();
        client.query(q.text,q.values,function(err,data) {
            if (callback) {
                if (err) callback(_.pick(err,errorfields),null); 
                else callback(null,_.pick(data,dataFields)); 
                }            
            else defaultExecCallback(err,data); 
            })
    } // run

var toFn = function(client,query)
    {
        var q = query.toQuery(); 
        return function(callback) { 
            client.query(q.text,
            q.values,
            function(err,data) { 
                if (err) callback(_.pick(err,errorFields),null); 
                else callback(null,_.pick(data,dataFields)); 
            })
        }
    }

var batch  = function(obj,callback) {
    async.series(
        obj ,
        function(err, results){
            if (callback) callback(err,results) 
            else defaultBatchCallback(err,results);
        }
    );
}

var toSelectFn = function(table,id) {
    
    return function(id)  {
        return table
            .select(table.columns)
            .from(table)
            .where(table.columns[0].equals(id))
    }
}


var toInsertFn = function(query,data)
{
    return function(data)  {
        // extracting primary key from data - ids are always generated
       
        return query
            .insert(_.pick(data,query._initialConfig.columns.slice(1)))
            .returning(query.columns);   
    }
}

var toUpdateFn = function(query,data)
{
    return function(data)  {
        return query
            .update(_.pick(data,query._initialConfig.columns.slice(1)))
            .where(query.columns[0]
                .equals(data[query._initialConfig.columns[0]]))
            .returning(query.columns); 
    }
}

var toDeleteFn = function(query,id)
{
    return function(id)  {
        return query.delete().where(query.columns[0].equals(id)); 
    }
}

var runBatch = function(client,queries,callback) 
{
    var x; 
    var iterator = function(item,callback) 
    { 
        var q = item.queryFn(item.param);
        console.log(q.toQuery());
        client.query(q.toQuery(),function(err,data)  { callback(err); })
    }

    async.eachSeries(queries,iterator,function(err) { 
       if (callback) callback(err); 
       else if (err) console.log(err);
            else console.log("Auftrag durchgeführt");
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

module.exports = {
    
    execute     : execute,
    batch       : batch,
    toFn        : toFn,
    toSelectFn  : toSelectFn,
    toUpdateFn  : toUpdateFn,
    toInsertFn  : toInsertFn,
    toDeleteFn  : toDeleteFn,
    client      : client,
    runBatch    : runBatch
    
}