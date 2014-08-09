angular.module('diagramModule',[])
	.directive('diagram', function() {
		return {
			restrict: 'A',
			scope: {
				values: '=ngModel',
                radius: '=',
                offset: '='
			},
			link: function(scope, elem, attrs) {                
                var labels = [[0,-15,"fruity"],
                              [18,-10,"floral"],
                              [22,-5,"spicy"],
                              [25,-2,"cereal"],
                              [22,0,"peaty"],
                              [25,10,"sulphury"],
                              [-17,10,"feinty"],
                              [-22,0,"nutty"],
                              [-27,-2,"woody"],
                              [-22,-5,"winey"],
                              [-32,-10,"chocolate"]];
                var lineColor = "#333";
                var anchors = new Array(11);
                var polygon = null;
                var paper = null;
                var radius = 120;
                var marginX = 50;
                var marginY = 20;
                var centerX = radius+marginX;
                var centerY = radius+marginY;                    
                var cvs = elem[0];
                var offsetX = cvs.offsetLeft;
                var offsetY = cvs.offsetTop;
                var angleOffset = Raphael.rad(90);
                var paper = new Raphael(cvs, 2*(radius+marginX), 2*(radius+marginY), null);
                
                var drawPolygon = function() {
                    if (polygon)
                        polygon.remove();

                    var path = "M" + anchors[10].attr("cx") + " " + anchors[10].attr("cy");
                    for (var i=0; i<11; i++) {
                        path += "L" + anchors[i].attr("cx") + " " + anchors[i].attr("cy");
                    }

                    polygon = paper.path(path);
                    polygon.attr("fill-opacity", 0.5);
                    polygon.attr("fill", "rgb(246, 177, 77)");
                    polygon.attr("stroke", lineColor);
                    polygon.toBack();
                }

                var calculateAnchorPosition = function(i) {
                    var angle = Raphael.rad(i*(360/11))-angleOffset;
                    var x = centerX + Math.cos(angle)*radius;
                    var y = centerY + Math.sin(angle)*radius;
                    var value = scope.values[i+scope.offset];
                    
                    var point = new Array(centerX, centerY);
                    if (centerX <= x && centerY >= y) {
                        point[0] = centerX + Math.round(((x-centerX)/100)*value);
                        point[1] = centerY - Math.round(((centerY-y)/100)*value);
                    }

                    if(centerX<=x && centerY<=y)
                    {
                        point[0]=centerX + Math.round(((x-centerX)/100)*value);
                        point[1]=centerY - Math.round(((centerY-y)/100)*value);
                    }

                    if(centerX>x && centerY<y)
                    {
                        point[0]=centerX - Math.round(((centerX-x)/100)*value);
                        point[1]=centerY - Math.round(((centerY-y)/100)*value);
                    }

                    if(centerX>x && centerY>=y)
                    {
                        point[0]=centerX - Math.round(((centerX-x)/100)*value);
                        point[1]=centerY + Math.round(((y-centerY)/100)*value);
                    }

                    return point;
                };
                
                function createAnchor(i) {
                    var angle = Raphael.rad(i*(360/11))-angleOffset;
                    var x = centerX + Math.cos(angle)*radius;
                    var y = centerY + Math.sin(angle)*radius;

                    var dragFunc = function(posX, posY) {
                        // calculate percentage of value
                        var point = new Array(0,0);
                        var percent = 0;

                        var newX = posX-offsetX;
                        var newY = posY-offsetY;

                        if (centerX <= x && centerY >= y) {
                            if (newX <= centerX) point[0] = 0;
                            if (newX >= x) point[0] = 100;
                            if (newX > centerX && newX < x) point[0] = Math.round( ((newX-centerX)*100) / (x - centerX));
                            if (newY >= centerY) point[1] = 0;
                            if (newY <= y) point[1] = 100;
                            if (newY < centerY && newY > y) point[1] = Math.round( ((centerY-newY)*100) / (centerY - y));
                        }

                        if(centerX<=x && centerY<=y)
                        {
                            if(newX<=centerX)point[0]=0;
                            if(newX>=x)point[0]=100;
                            if(newX>centerX && newX<x){point[0]=Math.round(   ((newX-centerX)*100) / (x-centerX)         );}
                            if(newY<=centerY)point[1]=0;
                            if(newY>=y)point[1]=100;
                            if(newY>centerY && newY<y){point[1]=Math.round(  ((newY-centerY)*100) / (y-centerY)           );}
                        }

                        if(centerX>x && centerY<y)
                        {
                            if(newX>=centerX)point[0]=0;
                            if(newX<=x)point[0]=100;
                            if(newX<centerX && newX>x){point[0]=Math.round(   ((centerX-newX)*100) / (centerX-x)         );}
                            if(newY<=centerY)point[1]=0;
                            if(newY>=y)point[1]=100;
                            if(newY>centerY && newY<y){point[1]=Math.round(  ((newY-centerY)*100) / (y-centerY)           );}
                        }

                        if(centerX>x && centerY>=y)
                        {
                            if(newX>=centerX)point[0]=0;
                            if(newX<=x)point[0]=100;
                            if(newX<centerX && newX>x){point[0]=Math.round(   ((centerX-newX)*100) / (centerX-x)         );}
                            if(newY>=centerY)point[1]=0;
                            if(newY<=y)point[1]=100;
                            if(newY<centerY && newY>y){point[1]=Math.round(  ((centerY-newY)*100) / (centerY-y)           );}
                        }

                        percent = Math.round((point[0]+point[1])/2);
                        if (point[0] === 0 || point[0] >= 100) percent = point[1];
                        if (point[1] === 0 || point[1] >= 100) percent = point[0];

                        return percent;
                    }
                    
                    paper.path("M"+centerX+" "+centerY+"L"+x+" "+y).attr("stroke", lineColor);
                    var text = paper.text(x+labels[i][0],y+labels[i][1], labels[i][2]);
                    text.attr("font-size", 13);
                    text.attr("fill", "#333");

                    var position = calculateAnchorPosition(i);
                    var anchor = paper.circle(position[0],position[1],3);
                    anchor.attr("fill", lineColor);
                    anchor.attr("stroke", lineColor)

                    anchor.drag(function(dx, dy, posX, posY, event) {
                        var value = dragFunc(posX, posY);
                        scope.updateValue(i, value);
                    });
                    
                    anchors[i] = anchor;
                }

                var updateAnchors = function() {
                    for (var i=0; i<11; i++) {
                        var pos = calculateAnchorPosition(i);
                        anchors[i].attr("cx",pos[0]);
                        anchors[i].attr("cy",pos[1]);
                    }
                    drawPolygon();
                }
                
                for (var i=1; i<6; i++)
                    paper.circle(centerX, centerY, (radius/5)*i).attr("stroke", lineColor);
                    
                for (var i=0; i<11; i++)
                    createAnchor(i);
                    
                scope.$watch('values', function(oldVal, newVal) {
                    updateAnchors();
				}, true);
			},
            controller: function($scope, $element) {
                $scope.updateValue = function(idx, value) {
                    $scope.values[idx+$scope.offset] = value;
                    $scope.$digest();
                }
            }
		};
	});
