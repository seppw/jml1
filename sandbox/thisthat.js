
var alertProvider = function() {
    this.setMessage = function(message,state,text) 
    { message.push({type : state, text : text})} 
    this.init = function() { return [];}
}

var messageProvider = function() {
    this.setMessage = function(message,state,text) 
    { 
        message.text = text
        message.state = state;
    } 
    this.init = function() { return  { state : "none",text : ""};}
}

var M = function(that,mp)
{
    
    that.message = mp.init(); 
    that.setMessage = function(text) { mp.setMessage(that.message,text); }
    that.clearMessage = function() { that.message = mp.init(); }
    
    return that;
}

var m = M({},new alertProvider()); 
console.log(m); 
m.setMessage("gehts ?");
console.log(m.message); 
m.clearMessage();
console.log(m.message); 

var m2 =  M({},new messageProvider());
console.log(m2); 
m2.setMessage("gehts ?");
console.log(m2.message); 
m2.clearMessage();
console.log(m2.message);