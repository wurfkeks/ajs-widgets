angular.module('ratingWidget',[])
	.directive('rating', function() {
		return {
			restrict: 'A',
			scope: {
				value: '=',
				max: '='
			},
			template: 	'<div class="rating">' +
							'<span ng-repeat="star in stars"' +
							    'ng-class="{over:over>$index,active:value>$index}" ' +
								'ng-click="toggle($index)" ' +
								'ng-mouseover="setOver($index)" ' +
								'ng-mouseout="setOver(-1)"' +
							'>' +
							'</span>' +
						'</div>',
			link: function(scope, elem, attrs) {
                if (attrs.readonly !== void 0)
                    scope.readonly = true;
                    
				var updateStars = function() {
					scope.stars = [];
					for (var i=0; i<scope.max; ++i) {
						scope.stars.push({});
					}
				};
				
				scope.$watch('value', function(oldVal, newVal) {
					if (newVal)
						updateStars();
				});
			},
			controller: function($scope) {
				$scope.over = 0;
				$scope.stars = [];
				$scope.readonly = false;
                
				for (var i=0; i<$scope.max; ++i) {
					$scope.stars.push({});
				}
				
				$scope.toggle = function(index) {
                    if (!$scope.readonly)
					$scope.value = index+1;
				};
				
				$scope.setOver = function(index) {
                    if (!$scope.readonly)
                        $scope.over = index+1;
				};
			}
		};
	});
