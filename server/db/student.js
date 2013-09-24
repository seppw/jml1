var sql = require("sql"); 
var db = require("./proxy");

var studentModel = {
    schema  : "import",
    name    : "student",
    columns : ["id","vorname","nachname","email","phone1","matnr","gebdat","gebort"]
};

var studiertModel = {
    schema  : "import",
    name    : "studiert",
    columns : ["id","matnr","studium","fach","lehrkraft","studkenn","jahr"]
}

var studentStudiertModel = {
    schema  : "import",
    name    : "student_view",
    columns : ["id","vorname","nachname","email","phone1","matnr","gebdat","gebort","studiert"]
};


var student = sql.define(studentModel); 
var studiert = sql.define(studiertModel); 
var studentStudiert = sql.define(studentStudiertModel); 

var findFn = function(para) {
    
    if (para && para.charAt(0) === "#")
        return studentStudiert
            .select(studentStudiert.columns)
            .from(studentStudiert)
            .where(studentStudiert.matnr.ilike(para.substr(1)));
        
    else {
        return studentStudiert
            .select(studentStudiert.columns)
            .from(studentStudiert)
            .where(studentStudiert.nachname.ilike(para)); 
    }
}

var registry = [
    
    { command : "student.find", fn : findFn }, 
    { command : "student.select", fn : db.toSelectFn(studentStudiert) },
    { command : "student.insert"  , fn : db.toInsertFn(student) }, 
    { command : "student.update"  , fn : db.toUpdateFn(student) }, 
    { command : "student.delete"  , fn : db.toDeleteFn(student) }, 

]

module.exports = {
    
    student         : student,
    studiert        : studiert,
    studentStudiert : studentStudiert,
    registry        : registry
        
}
