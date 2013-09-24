var fs = require('fs');
var odt = require('odt');
var path = require("path"); 
var result = require("./result");

var Job = function(template,out,values)
{
    this.template = template; 
    this.out = out; 
    this.values = values; 
}

var checkFiles = function(job,callback)
{
    var fd;  
    var res;
    // überprüfen der Template Datei
    res = result.success(
        "Dateien erfolgreich überprüft",
        job,
        null);
    
    try {
        fd = fs.openSync(job.template,'r'); 
        fs.closeSync(fd);
        }
    catch (err) { 
        res =  result.error(
            "Dokumentenvorlage '"+ path.basename(job.template)+"'kann nicht geöffnet werden",
            job,
            err);
 
        }
    
    // überprüfen der Out Datei
    try {
        fd = fs.openSync(job.out,'w'); 
        fs.closeSync(fd);
        }
    catch (err) { 
        res = result.error(
            "Dokumentdatei '" + path.basename(job.out) + "' kann nicht beschrieben werden",
            job,
            err);
   
        }
    
    callback(res);
    
}

var print = function(res,callback)
{
    var template = odt.template
    var job = res.data;
    var ret = result.success(
              "Formular '" + path.basename(job.out) + "' erzeugt",
              job,
              null);


    // variablen einsetzen
    template(job.template).apply(job.values) 

    .on('error', function(err)
    { 
        ret = result.error(
              "Fehler bei 'template.apply'",
              job,
              err);
    })

    .on('end', function(doc)
    {
 
        doc.pipe(fs.createWriteStream(job.out));
        
        //doc.on("error",function(err) { throw err; })
        
        doc.finalize(function(err){
            
            if (!ret.isValid()) callback(ret); 
            else {
                if (err) {
                    ret = result.error(
                        "Fehler bei 'doc.pipe'",
                        job,
                        err);
                    }
                callback(ret);     
                }
        
        });
    });
}

var printJob = function(job,callback) 
{
    checkFiles(job,function(res) {
        if (!res.isValid()) { callback(res)}
        else print(res,function(res) { callback(res)})
    })    
}

module.exports = {
    
    Job : Job,
    printJob : printJob
    
}; 