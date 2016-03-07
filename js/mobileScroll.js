(function() {
	var app = angular.module('eStore');
	app.directive('mobileScroll', function($window) {
		return function(scope, elem, attr) {
			var win = angular.element($window);
			scope.$watch(function() {
				return {
					'w' : win.width(),
					'h' : win.height()
				};
			}, function(newVal, oldVal) {
				scope.windowHeight = newVal.h;
				scope.windowWidth = newVal.w;
				scope.newWidth = function() {
					return {
						'width' : (newVal.w * 9) + 'px'
					};
				};
				scope.singleWidth = function() {
					return {
						'width' : (newVal.w - 52) + 'px'
					}
				}
				scope.right = function() {
					scope.leftRight('right');
				}

				scope.left = function() {
					scope.leftRight('left');
				}

				scope.leftRight = function(direction) {
					var current = $('.modal-body').css('transform').split(', ');
					var current = Number(current[4]);
					var multiplier = 0;
					if(direction == 'right') {
						multiplier = -1;
					} else {
						multiplier = 1;
					}
					var str = 'translate3d(' + (current + (multiplier * (newVal.w - 52))) + 'px, 0, 0)';
					$('.modal-body').css({transform: str});					
				}

			}, true);
			win.bind('mobileScroll', function() {
				scope.$apply();
			});

		}
	});
})();