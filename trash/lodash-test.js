var _ = require("lodash");  

var ud;
var ret  = _.pick({id : ud, name : "" },["id","name","label"])

console.log(ret); 

var obj = { data :  { id : 234 }}; 

var key = "data.id"; 
console.log("obj.data.id : %s = %s ",obj.data.id,obj["data"]["id"]); 
var f = key.split(".");
console.log(f);

var buff = obj; 
for (i = 0; i < f.length; i++ ) {
    k = f[i];
    buff = buff[k]; 
    console.log("[%s] : %s ",k,buff); 
}

console.log("-----");
