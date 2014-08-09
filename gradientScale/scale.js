angular.module('scale',[])
	.directive('scale', function() {
		return {
			restrict: 'A',
			scope: {
				value: '=',
				direction: '@'
			},
			template: 	'<div class="overlay" ng-style="overlayStyle" ng-mousedown="dragging = true; onUpdate($event)" ng-mouseup="dragging = false" ng-mouseleave="dragging = false" ng-mousemove="onMove($event)"></div><br >{{value}}',
			link: function(scope, elem, attrs) {
                scope.overlayStyle = {};
                scope.dragging = false;
                
                var updateOverlay = function() {
                    if (scope.direction==="vertical")
                        scope.overlayStyle = {"background-image":"-webkit-gradient(linear, 0% 100%, 0% 0%, from(rgba(255, 255, 255, 0)), color-stop("+scope.value+", rgba(255, 255, 255, 0)), color-stop("+scope.value+", rgba(255, 255, 255, 0.6)), to(rgba(255, 255, 255, 0.6)))"};
                    else if (scope.direction==="horizontal")
                        scope.overlayStyle = {"background-image":"-webkit-gradient(linear, 0% 0%, 100% 0%, from(rgba(255, 255, 255, 0)), color-stop("+scope.value+", rgba(255, 255, 255, 0)), color-stop("+scope.value+", rgba(255, 255, 255, 0.6)), to(rgba(255, 255, 255, 0.6)))"};
                    else
                        console.log("Direction unknown: "+scope.direction);
                };
                
				scope.$watch('value', function(oldVal, newVal) {
                    console.log("old value: "+oldVal);
                    console.log("new value: "+newVal);
					//if (newVal)
						updateOverlay();
				});
			},
			controller: function($scope) {             
				$scope.onUpdate = function(event) {
                    var overlay = event.target;
                    if ($scope.direction==="vertical") {
                        var posy = event.offsetY?(event.offsetY):event.pageY-overlay.offsetTop;
                        $scope.value = 1 - posy / (overlay.offsetHeight);
                    } else if ($scope.direction==="horizontal") {
                        var posx = event.offsetX?(event.offsetX):event.pageX-overlay.offsetLeft;
                        $scope.value = posx / (overlay.offsetWidth);
                    } else {
                        console.log("Direction unknown: "+$scope.direction);
                    }
                };
                
                $scope.onMove = function(event) {
                    if ($scope.dragging)
                        $scope.onUpdate(event);
                }
			}
		};
	});
