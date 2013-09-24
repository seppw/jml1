var client = angular.module("Client"); 

var Form = function(ident,scope ,socket) {
    
    this.ident  = ident; 
    this.scope  = scope; 
    this.data   = {};
    this.state  = "none"; 
    this.message = ""; 
    this.isOpen = false; 
        
    this.open = function(insMode,data) 
    { 
        this.insMode = insMode;
        this.data = data; 
        this.isOpen = true; 
    }

    this.getCtrl = function() { return this.scope[this.ident]; }
    this.isInvalid = function() { return this.getCtrl().$invalid; }
    
    this.save = function() 
    {
        if (this.getCtrl().$invalid) {
            alert("ungültiges formular !");
            return; 
        }
            
        if (this.insMode) socket.emit(ident + ".insert",this.data); 
        else socket.emit(ident+".update",this.data); 
    }

    var self = this
    saveCallback = function(result) 
    {
        console.log(self.close);
        
        self.state = result.state; 
        self.message = result.message; 
        // ????
        scope.message = result.message; 
        //if (result.data && result.data.length > 0) angular.copy(result.data[0],this.data); 
        
        if (self.state === "success") {
            self.close();  
            console.log(result);
            if (scope.detail) scope.detail.query(result.data[0].id); 
            if (scope.master) scope.master.refresh(); 
            }

    } 

    socket.on(this.ident + ".insert",saveCallback);
    socket.on(this.ident + ".update",saveCallback);
     
    this.close   = function() { this.isOpen = false }

}

client.factory("formProxy",function(socket) {
    
    return { init : function(ident,scope) { return new Form(ident,scope,socket)}}
    
})
