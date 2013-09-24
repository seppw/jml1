var client = angular.module('Client'); 

// update routeprovider

client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/hauptfach',
        {templateUrl: 'partials/hauptfach', controller: HauptfachCtrl});

    }
]);

// server interface
client.factory("hauptfach",function(data2) {
    
    var proxy = data2.crud("hauptfach");
    return { getProxy :  function() { return proxy; } }
    
})

// controller
HauptfachCtrl = function($scope,hauptfach,data2)
{
  
    $scope.proxy = hauptfach.getProxy(); 
    
    $scope.formMessage = { 
        setMessage : function(msg) { $scope.message = msg.text; }
    }
    
    $scope.form = data2.form(data2.formCommands("hauptfach"),//$scope.commands,
        [$scope.proxy.master,$scope.proxy.detail],
        $scope.formMessage,
        $scope.proxy.detailMessage);
    
}



