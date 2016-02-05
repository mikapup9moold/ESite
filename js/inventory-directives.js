(function() {
	var app = angular.module('inventory-directives', []);
	app.directive('invMenu', function() {
		return {
			restrict : 'A',
			templateUrl : 'inventory-menu.html',
			controller : function() {
				
			}
		}
	})
})