var client = angular.module('Client'); 

var Proxy = function(event,param,io) {
    
    this.event = event; 
    this.param = param; 
    this.response = {data : []}; 
    
    this.query = function(param) { 
        this.param = param;
        io.emit(this.event,param); 
        }
    
    this.isEmpty = function() { return this.response.data.length === 0; } 
    this.refresh = function() { io.emit(this.event,this.param);  }
    
    var self = this; 
    io.register(this.event,function(result) {  self.response = result; })

}

client.factory("db",function(io) 
{
    
    return { init : function(qualident,param) 
        { return new Proxy(qualident,param,io); } 
   }
    
}); 



