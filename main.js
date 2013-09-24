
var config  = require("./config.json");
var express = require("express");
var http    = require("http");
var util    = require("util");
var db      = require("./server/db/proxy");
var odt     = require("./server/odt/odt");
var port    = config.port;
var title   = config.name + "-" + config.version
var app     = express();

var server  = app.listen(port);
var io      = require("socket.io").listen(server);
var sockets = require("./server/db/sockets");
var student = require("./server/db/student");
var studium = require("./server/db/studium");
var faecher = require("./server/db/faecher");
// configure express

app.configure(function(){
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.locals.pretty = true;
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.static(__dirname + "/public"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

// routing
app.get('/partials/student',    function (req, res) { res.render('partials/student');});
app.get('/partials/protokoll',  function (req, res) { res.render('partials/protokoll');});
app.get('/partials/hauptfach',  function (req, res) { res.render('partials/hauptfach');});
app.get('/partials/fach',       function (req, res) { res.render('partials/fach');});
app.get('/partials/studium',    function (req, res) { res.render('partials/studium');});
app.get('/partials/studienzweig',function (req, res) { res.render('partials/studienzweig');});
app.get("/",function(req,res) { res.render("index", { title : title});});

// testing
var job = new odt.Job(
    __dirname + "/server/odt/test.odt",
    __dirname + "/server/odt/out.odt",
    null); 
    
job.label = "Inskriptionsbestätigung";


// configuring socket.io
io.set("log level",1);
io.on("connection",function(socket) {
    
    console.log("sockets connected with socket.id '%s'",socket.id);
    sockets.registerQueries(socket,db.client,student.registry); 
    sockets.registerQueries(socket,db.client,studium.registry); 
    sockets.registerQueries(socket,db.client,faecher.registry); 
    sockets.registerBatch(socket,db.client,"studium.crossViewInsert",studium.crossViewInsertBatch);
    sockets.registerPrintJob(socket,"print.inskrBest",job);
    sockets.registerOneToMany(socket,db.client,"fach.editSelect",faecher.obj);
    console.log(socket._events); 
 
}); 

console.log("------------------------------------");
console.log("running    : '%s' ... ",title);
console.log("------------------------------------");
console.log("start with : 'http://localhost:%s'",config.port); 
console.log("stop with  : 'CtrlC'"); 
console.log("------------------------------------");
