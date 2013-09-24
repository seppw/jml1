client = angular.module("Client"); 

var AlertProvider = function(filter) {
    
    this.filter = filter || ["success","info","warning","error"]; 

    this.setMessage = function(message,state,text) 
    { 
        if (_.contains(this.filter,state))
            message.push({type : state, text : text})
    } 
    this.init = function() { return [];}
}

var MessageProvider = function() {
    
    this.setMessage = function(message,state,text) 
    { 
        message.text = text
        message.state = state;
    } 
    this.init = function() { return  { state : "none",text : ""};}
}

RecordProvider = function()
{
    this.data = {}; 
    
    this.clear = function( ) { this.data = {}; }
    this.isEmpty = function() { return _.isEmpty(this.data); }
    
    this.setResultData = function(result) 
    {
        if (result.data == null) return; 
        if (result.data.length > 0)
            angular.copy(result.data[0],this.data); 
        else this.clear(); 
    } 
    
    this.setData = function(data)
    {
        if (_.isEmpty(data)) this.clear(); 
        else this.data = angular.copy(data,this.data);
    }
}

ListProvider = function()
{
    this.data = []; 
    
    this.clear = function( ) { this.data = []; }
    this.isEmpty = function() { return _.isEmpty(this.data); }
    this.setResultData = function(result)  { this.setData(result.data)} 
    
    this.setData = function(data)
    {
        this.clear(); 
        for (i = 0; i < data.length; i++ )
            this.data.push(data[i]);  
    }
}

Provider = function(that,messageProvider,refreshList) {
    
    that.refreshList = refreshList; 
    that.message = messageProvider.init(); 
    
    that.setMessage = function(state,text) 
    { messageProvider.setMessage(that.message,state,text); }
    
    that.clearMessage = function() 
    { that.message = messageProvider.init(); }
    
    that.setResult = function(result) {}
    
    return that; 
}

QueryProvider = function(that,event,io) {
 
    
    that.silent = false;
    that.param = null; 
 
    that.query = function(param) { 
        that.param = param; 
        io.emit(event,param); 
    }
    
    that.refresh = function(silent) { 
        that.silent = silent; 
        io.emit(event,that.param);  
    }
    
    that.setResult = function(result) 
    {
        that.clearMessage(); 
        that.setResultData(result); 
        _.each(that.refreshList,function(item) { item.refresh(true); });
        if (that.silent) {
            that.silent = false;
            return;
        }
        else that.setMessage(result.state,result.text);
        if (that.callback) that.callback(result); 
    }
   
    io.register(event,function(result)  { that.setResult(result)} )
    
    return that; 
  
}

SimpleProvider = function(event,filter,refreshList,messageProvider,io) 
{
     
    this.filter = filter; 
    this.refreshList = refreshList; 
    this.messageProvider = messageProvider; 
    
    this.query = function(param) 
    { io.emit(event,param); }
    
    this.setResult = function(result)
    {
        this.messageProvider({ type : result.state,text : result.text}); 
        _.each(this.refreshList,function(item) { item.refresh(true); });
    }
    // add responseListener
    var self = this;
    io.register(event,function(result) { self.setResult(result); }); 
    
}

FormProvider = function(that,qualident,parent,io) {
    
    that.insMode    = false; 
    that.isOpen     = false; 

    that.open = function(insMode,data) 
    { 
        that.insMode = insMode; 
        that.setData(data)
        that.isOpen = true; 
        //console.log(that.data);
    }
    
    that.close = function() { that.isOpen = false; }
   
    that.save = function()
    {
        if (that.insMode) io.emit(qualident + ".insert",that.data); 
        else io.emit(qualident + ".update",that.data); 
    }
    
    that.callback = function(result)  
    { 
        that.clearMessage(); 
        console.log(result); 
        if (result.state === "success") {
            _.each(that.refreshList,function(item) { item.refresh(true); });
            // parent.filter = all
            if (parent) parent.setResult(result);  
            // reset old parent filter
            that.isOpen = false; // close form
            }
        else that.setMessage(result.state,result.text);
    };
    // add socket listener
    io.register(qualident + ".insert",that.callback);
    io.register(qualident + ".update",that.callback);
    
    return that; 
   
}

client.service("data",function(io) {

    this.detail = function(event,filter,refreshList) {
        
        return QueryProvider(
            Provider(new RecordProvider(),
                        new AlertProvider(filter),
                        refreshList),
            event,io); 
        }
    
    this.master = function(event,filter,refreshList) { 

        return QueryProvider(
            Provider(new ListProvider(),
                        new AlertProvider(filter),
                        refreshList),
            event,io); 
        }

    this.simple = function(event,filter,refreshList,alertProvider) 
    { return new SimpleProvider(event,filter,refreshList,alertProvider,io);  }

    this.form = function(qualident,refreshList,parent) {
    
        return FormProvider(
            Provider(new RecordProvider(),
                new MessageProvider(),
                refreshList),qualident,parent,io); 
    }
})


