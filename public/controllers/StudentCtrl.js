StudentCtrl = function($scope,student2)
{
    
    $scope.student = student2.init(); 
    $scope.searchExpr = ""; 
   
    $scope.isSelected = function() 
    { return angular.isDefined($scope.student.single.data.matnr); }

    $scope.insertStudium  = function() 
    { alert("not implemented"); }

    $scope.removeStudium  = function() 
    { alert("not implemented"); }

}

