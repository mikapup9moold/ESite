(function() {
	var app = angular.module('eStore', ['firebase']);

	app.controller('InventoryController', function($scope, $firebaseObject) {
		var ref = new Firebase('https://blinding-heat-3195.firebaseio.com/menu');
		$scope.data = $firebaseObject(ref);
	});
})();