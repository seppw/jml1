client = angular.module("Client"); 

var showMessage = function(msg,filter,messageProvider)
{
    if (_.contains(filter,msg.state)) 
        messageProvider.setMessage(msg.state,msg.text);
}

var toListData = function(data) 
{
    ret = []; 
    if (!data) return ret; 
    if (data.length == 0) return ret; 
    ret = _each(data,function(item) { push[item]; })
    return ret; 
}

var toSingleData = function(data) 
{
    ret = {}; 
    if (!data) return ret; 
    if (data.length == 0) return ret; 
    angulr.copy(data[0],ret);
    return ret; 
}

/* master = new Reader(event,{ filter : [], alertProvider, toListData})
 * ... toSingleData
 * ... removeProvider(.. refreshList)
 * ... inxertProvider  
 */

var Reader = function(event,config,io) {
    
    this.event = event; 
    this.data = config.data;
    this.config = config; 
    this.param = null; 
    
    this.callback = function(result,config)
    {
        showMessage(result,config.filter,config.messageProvider); 
        if (result.state != "error") this.data = this.getData(result); 
    }
    
    this.query = function(param) 
    {
        this.param = param; 
        var self = this; 
        io.once(this.event,param,function(result) { callback(result,self.config);})
        _.each(config.refreshList,function(item) { item.refresh(); })
        
    }
    
    this.refresh = function() 
    {
        this.query(this.param);
    }
    
}