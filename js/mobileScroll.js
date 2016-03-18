(function() {
	var app = angular.module('mobScroll.directive', []);
	app.directive('mobileScroll', function($window) {
		return function(scope, elem, attr) {
			// Reset the position of the modal body after browsing is done.
			$('.modal').bind('show.bs.modal', function(e) {
				$('.modal-body').css({transform : 'translate3d(0, 0, 0)'});
				$('.mob-btn').css({transform : 'translate3d(0, 0, 0)'});
			});
			var win = angular.element($window);
			var amount = 9;
			scope.$watch(function() {
				return {
					'w' : win.width(),
					'h' : win.height()
				};
			}, function(newVal, oldVal) {
				scope.windowHeight = newVal.h;
				scope.windowWidth = newVal.w;
				scope.newWidth = function() {
					if(scope.windowWidth < 601) {
						scope.scrollWidth = newVal.w * amount;
						scope.scrollOffset = 52 * (amount - 1);
						return {
							'width' : scope.scrollWidth + 'px'
						};
					}
				};

				// Sets the width of a single item.
				scope.singleWidth = function() {
					if(scope.windowWidth < 601) {
						return {
							'width' : (newVal.w - 52) + 'px'
						};
					}
				}

				// Currently obsolete function that will be removed in future implementations.
				scope.rightButton = function() {
					if(scope.windowWidth < 601) {
						return{
							'margin-left' : (scope.windowWidth - 52 - 41) + 'px'
						}
					}
				}

				// Moves item collection left when right button is pressed.
				scope.right = function() {
					scope.leftRight('right');
				}

				// Moves item collection right when left button is pressed.
				scope.left = function() {
					scope.leftRight('left');
				}

				// Allows for left/right movement of item collection.
				// Accounts for edge cases where no more items remain in said direction.
				scope.leftRight = function(direction) {
					if($('.modal-body').attr('style').split(':').length <= 2) {
						$('.modal-body').css({transform: 'translate3d(0, 0, 0)'});
					} else if($('.modal-body').css('transform') == 'none') {
						$('.modal-bodu').css({transform: 'translate3d(0, 0, 0)'});
					}
					//var current = $('.modal-body').css('transform').split(', ');
					var current = $('.modal-body').attr('style').split('translate3d(')[1].split('px, ')[0];
					var current = Number(current);
					var multiplier = 0;
					var rightEdge = -(scope.scrollWidth - scope.windowWidth - scope.scrollOffset);
					if(direction == 'right' && current > rightEdge) {
						multiplier = -1;
					} else if(direction == 'left' && current < 0) {
						multiplier = 1;
					}
					var str = 'translate3d(' + (current + (multiplier * (newVal.w - 52))) + 'px, 0, 0)';
					var btn = 'translate3d(' + -(current + (multiplier * (newVal.w - 52))) + 'px, 0, 0)';
					$('.modal-body').css({transform: str});
					// needed to use the translate3d and if only want 1 set of buttons to stay stationary
					$('.mob-btn').css({transform: btn});
				}

			}, true);
			win.bind('mobileScroll', function() {
				scope.$apply();
			});
		}
	});
})();