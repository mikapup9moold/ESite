(function() {
	var app = angular.module('eStore', ['menu-directives']);

	app.controller('InventoryController', function($scope, $http) {
		$http.get('json/data.json').success(function(data) {
			$scope.menu = data.menu;
		});
	});
})();