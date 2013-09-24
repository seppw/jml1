/*
 * daten struktur schema "fach" in "faecher.sql" 
 */

var sql = require("sql"); 
var db = require("./proxy"); 
var async = require("async"); 
var _ = require("lodash");

var voTypModel = {
    schema  : "fach",
    name    : "vo_typ",
    columns : ["id","name","kurzname"]
};

var typModel = {
    schema  : "fach",
    name    : "typ",
    columns : ["id","name"]
};

var fachModel = {
    schema  : "fach",
    name    : "fach",
    columns : ["id","name","stunden","typ_id","vo_typ_id"]
};

var fachViewModel = {
    schema  : "fach",
    name    : "fach_view",
    columns : ["id","name","stunden","typ_id","vo_typ_id","vo_typ","typ"]
};

voTyp       = sql.define(voTypModel); 
typ         = sql.define(typModel); 
fach        = sql.define(fachModel); 
fachView    = sql.define(fachViewModel); 

var findFachFn = function(param)  { return fachView.select(); }
var findTypFn = function(param)  { return typ.select(); }
var findVoTypFn = function(param)  { return voTyp.select(); }

var registry = [
    
    { command : "fach.find"    , fn : findFachFn }, 
    { command : "fach.select"  , fn : db.toSelectFn(fachView) }, 
    { command : "fach.insert"  , fn : db.toInsertFn(fach) }, 
    { command : "fach.update"  , fn : db.toUpdateFn(fach) }, 
    { command : "fach.delete"  , fn : db.toDeleteFn(fach) },
    { command : "typ.find"  ,    fn : findTypFn },
    { command : "voTyp.find"  ,  fn : findVoTypFn }
]; 

module.exports = {
    registry            : registry
}

var fn = function(client,query,param) { 
    return function(callback)
        {
            var q = query(param).toQuery(); 
            client.query(q.text,q.values,function(err,data) {callback(err,data); })
        } 
    }
    

var obj = {
    data  : db.toSelectFn(fachView),
    typen : findTypFn,
    voTypen : findVoTypFn   
} 

 
var oneToMany = function(client,obj,param,callback) {    
    
    var req = {}; 
    for (prop in obj) { req[prop] = fn(client,obj[prop],param); }
    console.log(param);
    async.series(req,function(err,result) {

        if (err) callback(err,null); 
        else {
            var data = {};
            var i = 0; 
            for (prop in result) {
                if (i == 0) { 
                    if (result[prop].rows.length > 0) 
                        _.assign(data,result[prop].rows[0]); 
                    else data = {};
                }
                else data[prop] = result[prop].rows; 
                i++;
            }
            console.log(data); 
            callback(null,data); 

        } 

    }) 
}

module.exports = {
    registry            : registry,
    oneToMany           : oneToMany,
    obj                 : obj
}
//oneToMany(db.client,obj,25033,function(err,data) { console.log(data)}); 