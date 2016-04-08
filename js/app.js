(function() {
	var app = angular.module('eStore', ['firebase', 'ngAnimate', 'mobScroll.directive']);

	app.controller('InventoryController', function($scope, $firebaseObject) {
		var ref = new Firebase('https://blinding-heat-3195.firebaseio.com/menu');
		var syncObject = $firebaseObject(ref);
		syncObject.$bindTo($scope, "data")
			.then(function() {
				$scope.buildMobileList();
			});
/*		syncObject.$loaded()
			.then(function(data) {
				$scope.buildMobileList();
			})
			.catch(function(error) {
				console.log('Error:', error);
			}); */
		$scope.itemList = {};
		$scope.mobileToggleList = {};
		$scope.current = false;
		$scope.category = false;

		// Set transparent banner height for mobile devices
		$(document).ready(function() {
			var width = $(window).width();
			if(width <= 600) {
				$('.title').css('margin-top', (width * .445364) - 32 - 97);
			}
		});

		// Constructs local reference to all the available items for sale.
		// Acts as a key/value pair for referencing items by their unique name.
		$scope.buildList = function(key, value) {
			$scope.itemList[key] = value;
		}

		// Constructs local reference for the available items for the mobile implementation.
		// Data structure is: {'Bangles' : ['B1Anime Girl', 'B1Kabukii Man'], 'Earrings' :[]}
		$scope.buildMobileList = function() {
			for(var category in $scope.data) {
				if(category.charAt(0) !== '$') {
					$scope.mobileToggleList[category] = Object.keys($scope.data[category].inv);
				}
			}
		}

		// Sets the current item that is viewed by the user.
		$scope.setCurrent = function() {
			// Check to see if opening a modal or selecting an item
			if(this.value.modal) {
				$scope.category = this.key;
				$scope.current = this.value.first;
			} else {
				$scope.current = this.key;
			}
			//$('.modal-body').css({transform: 'translate3d(0, 0, 0)'});
		};

		// Boolean check for if an item should be displayed.
		$scope.isSet = function(itemName) {
			if($(window).width() < 601) {
				return true;
			}
			return $scope.current === itemName;
		};

		// Toggles left/right scroll for mobile implementation of available items.
		$scope.mobileToggle = function(lr, parent, item) {
			var list = $scope.mobileToggleList[parent];
			var len = list.length;
			var index;
			for(i = 0; i < len; i++) {
				if(list[i] == item) {
					index = i;
				}
			}
			$scope.setCurrent(list[index + lr]);

		}

		// Builds numbered index for a given range. (currently obsolete and unused in implemenation)
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

		// Adds a cart/wishlist item to the localStorage variable.
		$scope.addTo = function(list) {
			checkLists();
			var item = this.key;
			if(list == 'wish') {
				$('.glyphicon-list').addClass('wlist');
			} else if (list == 'cart') {
				$('.mod-list-btn.glyphicon-shopping-cart').addClass('scart');
				$('.scart').animate({fontSize: '24px'}, 500);
			}
			var id = item.replace(/\s+/g, '') + 'Qty';
			var num = $('#' + id + ' :selected').val();
			if(typeof(Storage) !== 'undefined') {
				localStorage[list] += (item + '#' + num + ',');
			} else {
				console.log('Local storage not available, store to cookies or on server linked to user account.');
			}
		};

		// Moves a cart/wishlist item from one list to another in localStorage.
		$scope.moveTo = function(item, amount, list) {
			localStorage[list] += (item + '#' + amount + ',');
			if(list == 'cart') {
				$scope.wishCat[item].moved = true;
			}
			if(list == 'wish') {
				$scope.cartCat[item].moved = true;
			}
		}

		// Builds scope reference of all items placed in cart/wishlist
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

		// Verifies that there is a localVariable for the cart/wishlist before other functions begin to store data there.
		// This is done to aviod the writing of 'undefined' to the cart/wishlist in localStorage.
		function checkLists() {
			if(typeof localStorage.cart === 'undefined') {
				localStorage.cart = '';
			}
			if(typeof localStorage.wish === 'undefined') {
				localStorage.wish = '';
			}
		}

		// Implements the cart/wishlist from localStorage string.
		$scope.buildCart = function() {
			// Initialize localStorage of cart and wishlist if they dont exist.
			checkLists();

			$scope.copied.cart = false;
			$scope.copied.wish = false;

			// Grab localStorage string and parse into workable format
			$scope.cart = toJSON(localStorage.cart);
			$scope.wish = toJSON(localStorage.wish);

			// Parse workable format further into referencable objects
			$scope.cartCat = buildHTML($scope.cart);
			$scope.wishCat = buildHTML($scope.wish);
		};

		// Set custom amount of items within cart/wishlist
		$scope.setAmount = function(type) {
			$('.fout').fadeOut("fast");
			var x;
			if(event.currentTarget.innerHTML == 'Delete') {
				x = 0;
			} else {
				x = this.value.num;
			}
			var key = this.key;
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

		// Provides smooth transition from one modal to the other.
		$scope.swapModal = function(mod2) {
			// Reset the position of the mobile scrolling.
			$('.modal-body').css({transform : 'translate3d(0, 0, 0)'});
			$('.mob-btn').css({transform : 'translate3d(0, 0, 0)'});
			var mod1;
			if(this.value) {
				mod1 = this.value.modal;				
			} else {
				if(mod2 == 'cart') {
					mod1 = 'wishList';
				} else {
					mod1 = 'cart';
				}
			}

			// Event listener necessary for smooth transition with Bootstrap's modals
			$("#" + mod1).on('hidden.bs.modal', function(e) {
				$("#" + mod2).modal('show');
				$("#" + mod1).off();
			});
			$("#" + mod1).modal('hide');
		}

		// Initialize the status of the 'Copy All to' button
		$scope.copied = {'cart' : false, 'wish' : false};

		// Copies one list to another.
		$scope.copyAll = function(list1, list2) {
			localStorage[list2] += localStorage[list1];
			$scope.copied[list1] = true;
		}

		// Deletes all items from specific list.
		// Also includes possibility of including an undo button.
		$scope.deleteAll = function(list) {
			var undo = 'undo' + list;
			localStorage[undo] = localStorage[list];
			localStorage[list] = '';
		}

	});

	// Allows for easy string manipulation within DOM for naming IDs
	app.filter('deleteSpaces', function() {
		return function(str) {
			if(!angular.isString(str)) {
				return str;
			}
			return str.replace(/\s+/g, '');
		}
	});

	// Allows for easy implementation of srcset for any image.
	app.filter('srcset', function() {
		return function(str) {
			if(!angular.isString(str)) {
				return str;
			}
			str = str.split('.');
			var all = '';
			for(i = 1; i <= 5; i++) {
				var x = i * 200;
				all += (str[0] + '-' + x + '.' + str[1] + ' ' + x + 'w, ');
			}
			all = all.slice(0, -2);
			return all;
		}
	});
})();