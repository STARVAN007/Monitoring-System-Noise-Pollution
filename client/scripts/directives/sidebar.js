(function () {
	angular
		.module('sonometerApp')
		.directive('sidebar', sidebar);

	function sidebar () {
		return {
	      templateUrl:'views/directives/sidebar.html',
	      restrict: 'E',
	      replace: true,
	      scope: {
	      },
	      controller:function($scope){
	        $scope.selectedMenu = 'dashboard';
	        $scope.collapseVar = 0;
	        $scope.multiCollapseVar = 0;
	        
	        $scope.check = function(x){
	          
	          if(x==$scope.collapseVar)
	            $scope.collapseVar = 0;
	          else
	            $scope.collapseVar = x;
	        };
	        
	        $scope.multiCheck = function(y){
	          
	          if(y==$scope.multiCollapseVar)
	            $scope.multiCollapseVar = 0;
	          else
	            $scope.multiCollapseVar = y;
	        };
	      }
	    }
	}
})();