var ConfigBuilder = function() 
{
    this.config = {
        
        event : null,
        messageProvider : { setMessage : null, filter : null },
        readData : null
        
        
    }; 
    
    this.setEvent = function(event) 
    { 
        this.config.event = event;
        return this; 
    }; 
    
    this.setMessageProvider = function(messageProvider) 
    { 
        this.config.messageProvider = messageProvider;
        return this; 
    }; 
    
    this.setMessageProvider = function(messageProvider) 
    { 
        this.config.messageProvider = messageProvider;
        return this; 
    }; 
    
    this.setFilter = function(filter) 
    { 
        this.config.messageProvider.filter = filter;
        return this; 
    }; 
    
}


