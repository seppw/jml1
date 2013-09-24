var fs = require('fs')
  , odt = require('odt')
  , template = odt.template
  , createWriteStream = fs.createWriteStream
var doc = 'test.odt';
var domain = require('domain');
var d = domain.create();
//var values = { 'name'  : 'Anita Hellein' };
var values = {
  "name": {
    "type": "string",
    "value": "Anita Hellein"
  }}

// apply values
d.on("error",function(err) {  console.log(typeof err);}); 

d.run(function() {
    
fs.exists(doc,function(exists) { 

if (!exists)  a = 0//throw new Error("nicht existent")
else {
 

template(doc)
  .apply(values)
  .on('error', function(err){
    throw err;
  })
  .on('end', function(doc){

    // write archive to disk.
    ws = createWriteStream('out.odt');
    ws.on("error",function(err) { throw err; })
    doc.pipe(ws)
    doc.on("error",function(err) { throw err; })
    doc.finalize(function(err){
      if (err) throw err;
      console.log('document written!');
    });
  });
}
})
}); 



