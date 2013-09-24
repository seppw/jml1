
var client = angular.module('Client'); 

// update routeprovider

client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when(
        '/student',
        {templateUrl: 'partials/student',controller: StudentCtrl}
    );
        
}]);

// server interface
client.factory("student",function(data2) {
    
    var proxy = data2.crud("student");
    return { getProxy :  function() { return proxy; } }
    
})

// controller

StudentCtrl = function($scope,student,socket,data2)
{
  
    $scope.proxy = student.getProxy(); 
    
    $scope.query = function()
    {
        $scope.proxy.master.query("%"); 
        
    }
    
    $scope.formMessage = { 
        setMessage : function(msg) { $scope.message = msg.text; }
    }
    
    $scope.form = data2.form(data2.formCommands("student"),//$scope.commands,
        [$scope.proxy.master,$scope.proxy.detail],
        $scope.formMessage,
        $scope.proxy.detailMessage);    
    
    
    console.log($scope.form);

    
    
    // formulare drucken
    
    $scope.print = { message :  [] }; 
    
    socket.on("print.inskrBest",function(res) 
    { 
        console.log(res); 
        $scope.print.message = []; 
        $scope.print.message.push({type : res.state, text : res.text}); 
        
    })
    
    $scope.print = function()
    {
        console.log("printing"); 
        var values = {
            "name": {
                "type": "string",
                "value": $scope.detail.data.nachname + " " + $scope.detail.data.vorname
                }}
        socket.emit("print.inskrBest",values); 
    }
}



