ProtokollCtrl = function($scope,socket)
{
    $scope.log = socket.getLog(); 
    
    $scope.test = function()
    {
        console.log(socket.getSocketEvents()); 
        
    }
    
    socket.on("test",function(result) { console.log(result); })
    
}

