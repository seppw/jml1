var client = angular.module('Client'); 

client.service("errorService",function() {
    
    var msg = {}; 
    msg["required"] = "Bitte Wert in Feld eingeben"; 
    msg["number"] = "Numerische Eingabe erwartet"; 
    msg["integer"] = "unvollständige oder ungültige Ganzzahl"; 
    msg["email"] = "unvollständige oder ungültige Mail Adresse";
    
    this.addError = function(key,text) {  msg[key] = text; }
    
    this.get = function(error) 
    {
        for(prop in error) 
            if (error[prop]) 
                if (msg[prop]) return msg[prop] 
                else return "'" + prop + "'" + " error";
        return ""; 
    }
    
    this.formErrors = function(formId)
    {
        var ret = []; 
        $("#" + formId + " :input").each(function()
        {
           if ($(this).hasClass("ng-invalid")) 
           {
               elem = angular.element($(this)); 
               ret.push(elem)
            }
        })  
        return ret; 
    }
    
    this.countFormErrors = function(formError)
    {
        var cnt = 0; 
        for (prop in formError) {
            if (formError[prop]) cnt += formError[prop].length; 
        }
        return cnt; 
    }
});

client.directive("errorCount",function(errorService) {
    
    return {
        restrict: 'A',
        link    : 
            function(scope,elem,attr) {
                scope.$watch(attr.errorCount + ".$error",
                function(value) {
                    elem.text(errorService.countFormErrors(value)
                        + " Fehler im Formular")
                },
                true)
        }
    }
})

client.service("qualify",function() {
    
    this.val = function(obj,qualident) 
    {
        var key,q = qualident.split("."); 
        for (i = 0; i < q.length; i++) {
            key = q[i];
            obj = obj[key];
            console.log("[%s] = %s",obj);
            }
    }
})

client.directive('sync', function(errorService,qualify) {

    var linker = function(scope, elem, attr,ctrl)
    {
       

        scope.$watch(attr.ngModel,function(value) 
        { 
            console.log(attr.sync);
            console.log(attr.syncSource);
            
            console.log(value);
           
            
        })
       

    }
    
    return  {
        
            restrict    : 'A',
            require     : 'ngModel',
            link        : linker,
           
            
        }
}); 

client.directive('error', function(errorService,qualify) {

    var linker = function(scope, elem, attr,ctrl)
    {
        var origTitle = attr.title || ''; 
        var label = attr.ngLabel; 
        var messageProvider = attr.messageProvider; 
               
        setTarget = function(state,text) 
        { 
            scope[attr.error] = text; 
            
        }        
                
        elem.bind('blur', function() 
        { setTarget("none","");  scope.$apply();});
            
        elem.bind('focus', function() 
        { 
            if (ctrl.$invalid) 
                setTarget("error",label + " : " + errorService.get(ctrl.$error)); 
            else setTarget("none",""); 
            scope.$apply(); 
        });
        
        ctrl.$parsers.push(function(value) {
            //console.log(ctrl.$error); 
            if (ctrl.$invalid) {
                //console.log("%s %s %s",label,"ERROR",errorService.get(ctrl.$error)); 
                setTarget("error",label + " : " + errorService.get(ctrl.$error)); 

            }
            else { 
                //console.log("%s %s",label,"OK")
                setTarget("none","");
                }
            return value; 
        });         
        
        ctrl.$formatters.push(function(value) {
            if (ctrl.$invalid) {
                //console.log("%s %s",label,"ERROR",errorService.get(ctrl.$error)); 
                setTarget("error",label + " : " + errorService.get(ctrl.$error)); 

            }
            else { 
                //console.log("%s %s",label,"OK")
                setTarget("none","");
                }
            return value; 
        });  
 
    }
    
    return  {
        
            restrict    : 'A',
            require     : 'ngModel',
            link        : linker
            
            
        }
}); 

