var SVGDraggable;
(function (SVGDraggable) {
    var SVGController = (function () {
        function SVGController() {
            this.loadSvgDraggables();
        }
        SVGController.prototype.loadSvgDraggables = function () {
            var svgElements = Array.prototype.slice.call(document.querySelectorAll('svg [draggable="true"]'));
            if (svgElements.length) {
                this.svgDraggableObjects = new Array();
                svgElements.forEach(function (svgElement, index) {
                    this.svgDraggableObjects.push(new SVGDraggable.SVGObject(svgElement));
                }, this);
            }
        };
        return SVGController;
    }());
    SVGDraggable.SVGController = SVGController;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    var Drag = (function () {
        function Drag() {
            var _this = this;
            this.onMousemove = function (event) { _this.onSVGDraggableMousemove(event, _this.svgObject); };
            this.runOnce = false;
            //this.svgObject = new SVGObject();
            //this.registerEvents();
        }
        Drag.prototype.registerEvents = function () {
            var _this = this;
            var svgDraggables = Array.prototype.slice.call(document.querySelectorAll('svg [draggable = "true"]'));
            svgDraggables.forEach(function (svgDraggable, index) {
                var _this = this;
                svgDraggable.addEventListener('mousedown', function (event) { return _this.onSVGDraggableMousedown(event, _this.svgObject); });
            }, this);
            window.addEventListener('mouseup', function (event) { _this.onMouseup(event); });
        };
        // Sets the starting upperleft corner of SVG element to calculate assist with calculating drag
        Drag.prototype.onSVGDraggableMousedown = function (event, svgObject) {
            var svg = this.svgElement = event.currentTarget;
            var svgSvg = svg;
            var svgPoint = svgSvg.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            var startPoint = svgPoint.matrixTransform(svgSvg.getScreenCTM().inverse());
            svgObject.startMoveX = startPoint.x;
            svgObject.startMoveY = startPoint.y;
            if (!this.runOnce) {
                svgObject.initialX = startPoint.x;
                svgObject.initialY = startPoint.y;
                this.runOnce = true;
            }
            svg.addEventListener('mousemove', this.onMousemove);
        };
        Drag.prototype.onMouseup = function (event) {
            if (this.svgElement) {
                this.svgElement.removeEventListener('mousemove', this.onMousemove);
                this.svgElement.setAttribute('hasMouseMoveEvent', 'false');
                this.svgObject.newX = this.svgObject.endX;
                this.svgObject.newY = this.svgObject.endY;
            }
            this.svgElement = undefined;
        };
        Drag.prototype.onSVGDraggableMousemove = function (event, svgObject) {
            var svg = event.currentTarget;
            var svgSvg = svg;
            var g = svg.querySelector('g');
            var pt = svgSvg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var svgCursorLocation = pt.matrixTransform(svgSvg.getScreenCTM().inverse());
            var mouseMoveX = svgCursorLocation.x - svgObject.startMoveX;
            var mouseMoveY = svgCursorLocation.y - svgObject.startMoveY;
            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svgSvg.createSVGTransform();
                newTransform.setTranslate(mouseMoveX, mouseMoveY);
                g.transform.baseVal.appendItem(newTransform);
            }
            else {
                g.transform.baseVal.getItem(0).setTranslate(mouseMoveX + svgObject.newX, mouseMoveY + svgObject.newY);
                svgObject.endX = mouseMoveX + svgObject.newX;
                svgObject.endY = mouseMoveY + svgObject.newY;
            }
        };
        return Drag;
    }());
    SVGDraggable.Drag = Drag;
    var SVGObject = (function () {
        function SVGObject(element) {
            this.newX = 0;
            this.newY = 0;
            this.svgElement = element;
        }
        return SVGObject;
    }());
    SVGDraggable.SVGObject = SVGObject;
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map