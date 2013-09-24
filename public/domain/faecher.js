var client = angular.module('Client'); 

// update routeprovider

client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/fach',
        {templateUrl: 'partials/fach', controller: FachCtrl});

    }
]);

// server interface
client.factory("fach",function(data2) {
    
    var proxy = data2.crud("fach");
    
    return { getProxy :  function() { return proxy; } }
    
})

// controller
FachCtrl = function($scope,fach,data2,io)
{
    $scope.fachTyp = null; 
    $scope.voTyp = null; 
  
    $scope.proxy = fach.getProxy(); 
        
    $scope.formMessage = { 
        setMessage : function(msg) { $scope.message = msg.text; }
    }
    
    var formCommands = {
            insert : { event : "fach.insert",
                openEvent : "fach.editSelect",
                proxyFn : data2.asSingleResult()},
            copy : { event : "fach.insert",
                openEvent : "fach.editSelect",
                proxyFn : data2.asSingleResult()},
            update : { 
                event : "fach.update",
                openEvent : "fach.editSelect",
                proxyFn : data2.asSingleResult() }
        }
    
    $scope.form = data2.form(formCommands,//$scope.commands,
        [$scope.proxy.master,$scope.proxy.detail],
        $scope.formMessage,
        $scope.proxy.detailMessage);
    

    $scope.openForm = function(mode,id) {
        console.log("%s %s",mode,id); 
        $scope.form.open(mode,id)
    }
    
    $scope.form.afterOpen = function(command,event) 
    {
        if (event == "copy") { $scope.form.data.id = null; }
        
        $scope.fachTyp =  _.find($scope.form.data.typen,function(item) { 
            return item.id == $scope.form.data.typ_id
            });
        $scope.voTyp =  _.find($scope.form.data.voTypen,function(item) { 
            return item.id == $scope.form.data.vo_typ_id
            })
    }
    
    $scope.$watch("fachTyp",function(value) 
    { if (value) $scope.form.data.typ_id = value.id; })
   
    $scope.$watch("voTyp",function(value) 
    {  if (value) $scope.form.data.vo_typ_id = value.id; })
}



