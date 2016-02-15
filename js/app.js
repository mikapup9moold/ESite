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
		//localStorage.cart = '';
		//localStorage.wish = '';

		$scope.addTo = function(item, list) {
			var id = item.replace(/\s+/g, '') + 'Qty';
			var num = $('#' + id + ' :selected').val();
			if(typeof(Storage) !== 'undefined') {
				localStorage[list] += (item + '#' + num + ',');
			} else {
				console.log('Local storage not available, store to cookies or on server linked to user account.');
			}
		};

		$scope.moveTo = function(item, amount, list) {
			localStorage[list] += (item + '#' + amount + ',');
			if(list == 'cart') {
				$scope.wishCat[item].moved = true;
			}
			if(list == 'wish') {
				$scope.cartCat[item].moved = true;
			}
		}

		function buildHTML(list) {
			var obj = {};
			var total = 0;
			for(var item in list) {
				obj[item] = {};
				obj[item].num = list[item];
				obj[item].moved = false;
				total += (list[item] * $scope.itemList[item].price);
			}
			obj.total = total;
			return obj;
		}

		$scope.buildCart = function() {
			// Initialize localStorage of cart and wishlist if they dont exist.
			if(typeof localStorage.cart === 'undefined') {
				localStorage.cart = '';
			}
			if(typeof localStorage.wish === 'undefined') {
				localStorage.wish = '';
			}
			$scope.cart = toJSON(localStorage.cart);
			$scope.wish = toJSON(localStorage.wish);
			$scope.cartCat = buildHTML($scope.cart);
			$scope.wishCat = buildHTML($scope.wish);
		};

		$scope.setAmount = function(key, x, type) {
			$('.fout').fadeOut("fast");
			var catalog = type + 'Cat';
			var diff = ($scope[catalog][key].num - x);
			$scope[catalog][key].num = x;
			$scope[catalog][key].total -= ($scope.itemList[key].price * diff);
			var str = '';
			for(var item in $scope[catalog]) {
				if($scope[catalog][item].num !== 0) {
					str += (item + '#' + $scope[catalog][item].num + ',');
				}
			}
			str = str.replace('total#undefined,', '');
			localStorage[type] = str;
			$('.fout').fadeIn("slow");
		}

		$scope.swapModal = function(mod1, mod2) {
			$("#" + mod1).on('hidden.bs.modal', function(e) {
				$("#" + mod2).modal('show');
				$("#" + mod1).off();
			});
			$("#" + mod1).modal('hide');
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