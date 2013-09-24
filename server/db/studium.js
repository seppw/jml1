var sql = require("sql"); 
var db = require("./proxy"); 

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

var zweigModel = {
    schema  : "studium",
    name    : "zweig",
    columns : ["id","name","kurzname","label","diplom"]
};

var abschnittModel = {
    schema  : "studium",
    name    : "abschnitt",
    columns : ["id","zweig_id","index","dauer"]
};

var zweigViewModel = {
    schema  : "studium",
    name    : "zweig_abschnitt_view",
    columns : ["id","name","kurzname","label","diplom","abschnitt"]
};

var studiumViewModel = {
    schema  : "studium",
    name    : "studium_view",
    columns : ["id","zweig_id","hauptfach_id","zweig","hauptfach",
               "zweig_kurzname","hauptfach_kurzname","abschnitt"]
};

var crossHauptfachViewModel = {
    schema  : "studium",
    name    : "cross_hauptfach_view",
    columns : ["zweig_id","hauptfach_id","zweig","hauptfach",
               "zweig_kurzname","hauptfach_kurzname","studium_id"]
};

studium     = sql.define(studiumModel);  
hauptfach   = sql.define(hauptfachModel); 
zweig       = sql.define(zweigModel); 
abschnitt   = sql.define(abschnittModel); 
zweigView   = sql.define(zweigViewModel);
studiumView = sql.define(studiumViewModel); 
crossHauptfachView = sql.define(crossHauptfachViewModel); 

var findHaupfachFn = function() 
{
   return hauptfach.select(hauptfach.columns).from(hauptfach);
}

var findZweigFn = function() 
{
   return zweig.select(zweig.columns).from(zweig);
}

var findStudiumHaupfachFn = function(para) 
{
   return studiumView.
       select(studiumView.columns).
       from(studiumView).
       where(studiumView.zweig_id.equals(para));
}

var findCrossViewFn = function(para) 
{
   return crossHauptfachView.
       select(crossHauptfachView.columns).
       from(crossHauptfachView).
       where(crossHauptfachView.zweig_id.equals(para));
}

var deleteCrossViewFn = function(id) 
{ 
    return studium.delete().where(studium.zweig_id.equals(id));
}
var insertCrossViewFn = function(data) { return studium.insert(data);}

var crossViewInsertBatch = [deleteCrossViewFn,insertCrossViewFn]; 


var registry = [

    { command : "studiumView.select",fn : db.toSelectFn(studiumView) }, 
    { command : "studiumHauptfach.find", fn : findStudiumHaupfachFn }, 
    { command : "hauptfach.find"    , fn : findHaupfachFn }, 
    { command : "hauptfach.select"  , fn : db.toSelectFn(hauptfach) }, 
    { command : "hauptfach.insert"  , fn : db.toInsertFn(hauptfach) }, 
    { command : "hauptfach.update"  , fn : db.toUpdateFn(hauptfach) }, 
    { command : "hauptfach.delete"  , fn : db.toDeleteFn(hauptfach) }, 
    { command : "studienzweig.find"    , fn : findZweigFn }, 
    { command : "studienzweig.select"  , fn : db.toSelectFn(zweigView) }, 
    { command : "studienzweig.insert"  , fn : db.toInsertFn(zweig) }, 
    { command : "studienzweig.update"  , fn : db.toUpdateFn(zweig) }, 
    { command : "studienzweig.delete"  , fn : db.toDeleteFn(zweig) }, 
    { command : "abschnitt.delete"  , fn : db.toDeleteFn(abschnitt) }, 
    { command : "abschnitt.update"  , fn : db.toUpdateFn(abschnitt) }, 
    { command : "abschnitt.insert"  , fn : db.toInsertFn(abschnitt) }, 
    { command : "studiumCrossView.find"  , fn : findCrossViewFn },
    { command : "studium.delete"  , fn : db.toDeleteFn(studium) } 
    // studiumCrossView.insert
]

module.exports = {
    
    studiumView         : studiumView,
    studium             : studium,
    zweig               : zweig,
    hauptfach           : hauptfach,
    crossHauptfachView  : crossHauptfachView,
    registry            : registry,
    crossViewInsertBatch:crossViewInsertBatch
    
}

