var client = angular.module('Client'); 
// update routeprovider
client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/studienzweig',
        {templateUrl: 'partials/studienzweig', controller: StudienZweigCtrl});

    }
]);

// server interface
client.factory("studienzweig",function(data2) {
    
    var proxy = data2.crud("studienzweig");
    return { getProxy :  function() { return proxy; } }
    
})

// controller
StudienZweigCtrl = function($scope,data2,studienzweig)
{
    
    $scope.proxy = studienzweig.getProxy();

    $scope.formMessage = { 
        setMessage : function(msg) { $scope.message = msg.text; }
    }
    
    
    $scope.form = data2.form(data2.formCommands("studienzweig"),//$scope.commands,
    [$scope.proxy.master,$scope.proxy.detail],
    $scope.formMessage,
    $scope.proxy.detailMessage)
    
    console.log($scope.form);
    /*scope.form   = data.form("studienzweig",[$scope.master],$scope.detail)
    
    // studiensbschnitt
    //$scope.remove_abschnitt = data.detail("abschnitt.delete",null,[$scope.detail]);
    //$scope.abschnitt_form   = data.form("abschnitt",[$scope.detail])
    
    //$scope.form.setMessage = function(state,text) { $scope.message = text; }
    $scope.abschnitt_form.setMessage = function(state,text) { $scope.abschnitt_message = text; }


    $scope.neuerAbschnitt = function()
    { console.log("neuer Abschnitt"); }

    $scope.loescheAbschnitt = function(id)
    { 
        console.log("lösche Abschnitt %",id);
        
        $scope.remove_abschnitt.query(id);
        //scope.detail.refresh(); 
    }
    */
}



