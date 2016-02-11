(function() {
	var app = angular.module('eStore', ['firebase']);

	app.controller('InventoryController', function($scope, $firebaseObject) {
		var ref = new Firebase('https://blinding-heat-3195.firebaseio.com/menu');
		var syncObject = $firebaseObject(ref);
		syncObject.$bindTo($scope, "data");
		$scope.itemList = {};
		$scope.current = false;
		$scope.buildList = function(key, value) {
			$scope.itemList[key] = value;
		}
		$scope.setCurrent = function(itemName) {
			$scope.current = itemName;
		};
		$scope.isSet = function(itemName) {
			return $scope.current === itemName;
		};
		$scope.range = function(num) {
			var range = [];
			num = parseInt(num);
			for(i = 1; i <= num; i++) {
				range.push(i);
			}
			return range;
		};
		localStorage.cart = '';
		localStorage.wish = '';

		$scope.addTo = function(item, list) {
			var id = item.replace(/\s+/g, '') + 'Qty';
			var num = $('#' + id + ' :selected').val();
			if(typeof(Storage) !== 'undefined') {
				localStorage[list] += (item + '#' + num + ',');
			} else {
				console.log('Local storage not available, store to cookies or on server linked to user account.');
			}
		};

		function buildHTML(list, set) {
			var obj = {};
			var total = 0;
			for(var item in list) {
				obj[item] = {};
				obj[item].num = list[item];
				total += (list[item] * $scope.itemList[item].price);
			}
			obj.total = total;
			return obj;
		}

		$scope.buildCart = function() {
			$scope.cart = toJSON(localStorage.cart);
			$scope.wish = toJSON(localStorage.wish);
			$scope.cartCat = buildHTML($scope.cart);
			$scope.wishCat = buildHTML($scope.wish);
		};

		$scope.setAmount = function(key, x) {
			$('.fout').fadeOut("fast");
			var diff = ($scope.cartCat[key].num - x);
			$scope.cartCat[key].num = x;
			$scope.cartCat[key].total -= ($scope.itemList[key].price * diff);
			var str = '';
			for(var item in $scope.cartCat) {
				if($scope.cartCat[item].num !== 0) {
					str += (item + '#' + $scope.cartCat[item].num + ',');
				}
			}
			str = str.replace('total#undefined,', '');
			localStorage.cart = str;
			$('.fout').fadeIn("slow");
		}

	});

	app.filter('deleteSpaces', function() {
		return function(str) {
			if(!angular.isString(str)) {
				return str;
			}
			return str.replace(/\s+/g, '');
		}
	});
})();