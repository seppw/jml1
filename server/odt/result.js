var ERROR = "error";
var INFOR = "info";
var WARNING = "warning";
var SUCCESS = "success";

var Result = function(state,text,data,error) {
    
    this.state = state; 
    this.text = text; 
    this.data = data; 
    this.error = error; 
    
    this.isError = function() { return this.state === ERROR; }
    this.isSuccess = function() { return this.state === SUCCESS; }
    this.isWarning = function() { return this.state === WARNING; }
    this.isInfo = function() { return this.state === INFO; }
    this.isValid = function() { return !this.isError(); } 
    this.toString = function() { return state + " : " + text}
    
    this.toData = function()
    {
        return { 
            state : this.state, 
            text : this.text,
            data : this.data,
            error : this.error
        }
    }
}

var error = function(text,data,error) 
{ return new Result(ERROR,text,data,error); }

var warning = function(text,data,error) 
{ return new Result(WARNING,text,data,error); }

var info = function(text,data,error) 
{ return new Result(INFO,text,data,error); }

var success = function(text,data,error) 
{ return new Result(SUCCESS,text,data,error); }

module.exports = {
    
    error   : error,
    warning : warning,
    info    : info,
    success : success
   
};  