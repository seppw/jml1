client = angular.module("Client"); 

var toMessage = function(result) 
{ return { state : result.state, text : result.text }; }

var toSingleResult = function(result)
{
    var data = {}; 
    if (result.data && result.data.length > 0) angular.copy(result.data[0],data); 
    return { msg : toMessage(result), data : data }
}

var asSingleResult = function(result)
{
    console.log(result.data);
    return { msg : toMessage(result), data : result.data }
}

var toListResult = function(result)
{
    var data = []; 
    if (result.data && result.data.length > 0) 
        for (i = 0; i < result.data.length; i++) data.push(result.data[i]); 
    return { msg : toMessage(result), data : data }
}


SimpleProvider = function(event,proxyFn,filter,refreshList,messageProvider,io) 
{
    this.param = null;  
    this.filter = filter; 
    this.refreshList = refreshList; 
    this.messageProvider = messageProvider; 
    this.data = {}; 
    this.proxyFn = proxyFn; 
    this.silent = false; 
    
    this.query = function(param,silent) 
    { 
        this.param = param;
        this.silent = silent; 
        io.emit(event,param); 
    }
    
    this.refresh = function(silent) 
    { 
        this.silent = silent; 
        this.query(this.param,silent); 
    }
    
    this.setMessage = function(msg)
    {
        if (this.messageProvider && !this.silent && _.contains(this.filter,msg.state)) 
        this.messageProvider.setMessage(msg);
    }
    
    this.setResult = function(result)
    {
        var proxy = this.proxyFn(result); 
        this.data = proxy.data; 
        this.setMessage(proxy.msg); 
        this.silent = false;
        _.each(this.refreshList,function(item) { item.refresh(true); });

    }
    
    this.isEmpty = function() { return _.isEmpty(this.data); }
    
    // add responseListener
    var self = this;
    io.register(event,function(result) { self.setResult(result); }); 
    
}

AlertProvider = function()
{
    this.alert = []; 
    
    this.setMessage = function(msg) 
    {
        this.alert = []; 
        this.alert.push(msg); 
    }
    
    this.close = function() { this.alert = [];  }
    
}

FormProvider = function(commands,
    refreshList,
    
    messageProvider,
    calleeMessageProvider,
    io) 
    
{
    this.isOpen         = false; 
    this.data           = {};
    this.commands       = commands; 
    this.command        = null; 
    this.event          = null;
    this.refreshList    = refreshList; 
    this.messageProvider = messageProvider;
    this.calleeMessageProvider = calleeMessageProvider;

    this.openCallback = function(result,proxyFn) 
    {
        var proxy = proxyFn(result); 
        console.log("proxy %s",proxy);
        if (proxy.msg.state === "error" || _.isEmpty(proxy.data))
            this.calleeMessageProvider.setMessage(proxy.msg); 
        else {
            this.messageProvider.setMessage(proxy.msg); 
            this.data = proxy.data; 
            this.isOpen = true; 
            if (this.afterOpen) this.afterOpen(this.command,this.event); 
            }
    }

    this.open = function(command,para) 
    { 

        this.command = commands[command]; 
        this.event = command;
        
        if (this.command.proxyFn) {
            
            var self = this; 
            io.once(this.command.openEvent,para,
                function(result)
                {   console.log(result);
                    self.openCallback(result,self.command.proxyFn); })
            }
        else { 
            this.data = {}; 
            this.isOpen = true; 
            if (this.afterOpen) 
            this.afterOpen(this.command,this.event);
        }
    }
    
    this.close = function() { this.isOpen = false; }
    
    this.reload = function(param) 
    { this.parent.query(param); }
    
    var self = this; 
    this.callback = function(result)  
    { 
        console.log("%s : %s",result.state,result.text);
        if (result.state === "success") {
            _.each(self.refreshList,function(item) { item.refresh(true); });
            
            self.calleeMessageProvider.setMessage(toMessage(result));
            self.isOpen = false; // close form
            }
        else self.messageProvider.setMessage(toMessage(result));
    };
   
    this.save = function()
    {
        console.log(this.command); 
        io.once(this.command.event,this.data,this.callback); 
    }
}

/*  $scope.fachTyp =  _.find($scope.form.data.typen,function(item) { 
*            return item.id == $scope.form.data.typ_id
*            });
*/

var matchFn = function(id, item) { return item.id == id}

var Selector = function(id,list,matchFn)
{
    this.init = function(id) 
    {
        _.find(list,function(item) { 
           return matchFn(item,id)
        
    })
    }
    
    
}


client.service("data2",function(io) {

    this.record = function(event,filter,refreshList,alertProvider) 
    { return new SimpleProvider(event,toSingleResult,filter,refreshList,alertProvider,io);  }

    this.list = function(event,filter,refreshList,alertProvider) 
    { return new SimpleProvider(event,toListResult,filter,refreshList,alertProvider,io);  }

    this.alert = function() { return new AlertProvider(); }

    this.form = function(commands,refreshList,messageProvider,calleeMessageProvider) 
    { return new FormProvider(commands,refreshList,messageProvider,calleeMessageProvider,io);  }

    this.toSingleResult = function() { return toSingleResult; } 
    this.toListResult = function() { return toListResult; } 
    this.asSingleResult = function() { return asSingleResult; } 
    
    var self = this; 
    
    this.formCommands = function(table) {
        return {
            insert : { event : table + ".insert"},
            update : { 
                event : table + ".update",
                openEvent : table + ".select",
                proxyFn : self.toSingleResult() }
        }
    } 
    
    this.crud = function(table) 
    {
        console.log("crud(" + table + ")");
        
        var masterMessage = self.alert(); 
        var detailMessage = self.alert(); 

        var master = self.list(table + ".find",["error","warning"],[],masterMessage); 
        var detail = self.record(table + ".select",null,[],detailMessage); 
        var remove = self.record(table + ".delete",["error","warning","success"],
            [master,detail],
            detailMessage); 

        master.query(); 

        return { 
            master : master, 
            detail : detail,
            remove : remove,
            masterMessage : masterMessage,
            detailMessage : detailMessage
            }  
    }   // crud
    
})


