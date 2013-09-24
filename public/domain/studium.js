var client = angular.module('Client'); 

// update routeprovider

client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/studium',
        {templateUrl: 'partials/studium', controller: StudiumCtrl});

    }
]);

// DB

client.factory("studium",function(data2) {
    
    // var master = data2.list("hauptfach.find",["error","warning"],[]); 
    var king    = data2.list("studienzweig.find",["error","warning"],[]);
    var master  = data2.list("studiumHauptfach.find",["error","warning"],[]); 
    var detail  = data2.record("studiumView.select",["error","warning"],[]); 
    
    king.query(); 
    king.zweig = {};
    king.callback = function(result) 
    { king.zweig = result.data[0]; } 
    
    return { getProxy : function() { 
            return { king : king, master : master, detail : detail }  
        }} 
    
})
// controller
StudiumCtrl = function($scope,studium,socket,data2)
{
    $scope.king   = studium.getProxy().king;
    $scope.master = studium.getProxy().master;
    $scope.detail = studium.getProxy().detail;
    
    $scope.detailMessage = data2.alert(); 
    $scope.masterMessage = data2.alert();                                                            
    
    $scope.master.messageProvider = $scope.masterMessage; 
    $scope.detail.messageProvider = $scope.detailMessage; 

// studium löschen
    $scope.remove = data2.simple("studium.delete",
        null,
        [$scope.master,$scope.detail],
        $scope.masterMessage); 

    $scope.doRemove = function(id) 
    {
        console.log($scope.remove);
        $scope.remove.query(id);
    }

  
    $scope.$watch('king.zweig',function(value) 
    { $scope.master.query(value.id); })
    
    $scope.form = {
        isOpen  : false,
        close   : function() { $scope.form.isOpen = false; },
        data    : []
    }
    
    $scope.form.open = function() 
    {
        $scope.form.isOpen = true; 
        socket.emit("studiumCrossView.find",$scope.king.zweig.id)
    } 
    
    socket.on("studiumCrossView.find",function(result) 
    { 
        console.log(result);
        if (result.state == "error") {
            alert(result.text); 
            return; 
        }
        $scope.form.data = []; 
        for (i = 0; i < result.data.length; i++) {
            $scope.form.data.push(result.data[i]); 
            $scope.form.data[i].selected = result.data[i].studium_id !== null;
            }
    

    })
    
    $scope.form.selectAll = function()
    {
        for (i = 0; i < $scope.form.data.length; i++) 
        { $scope.form.data[i].selected = true; }
    }
    
    $scope.form.invertAll = function()
    {
        for (i = 0; i < $scope.form.data.length; i++) 
        { $scope.form.data[i].selected = !$scope.form.data[i].selected }
    }
    
    $scope.form.save = function()
    {
        var param0 = $scope.king.zweig.id;
        var param1 = [];
        
        for (i = 0; i < $scope.form.data.length; i++) {
            if ($scope.form.data[i].selected) {
                param1.push({ zweig_id : $scope.form.data[i].zweig_id,
                    hauptfach_id : $scope.form.data[i].hauptfach_id})
            } 
        }
        socket.emit("studium.crossViewInsert",[param0,param1]);
    }
    
    socket.on("studium.crossViewInsert",function(resp) 
    { 
        
        if (resp.state === "success") resp.text = "Hauptfächer angelegt";
        $scope.masterMessage.setMessage({ type : resp.state, text : resp.text })
        $scope.form.close(); 
        $scope.master.refresh(); 
    })
    
}



