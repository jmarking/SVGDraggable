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
                    this.svgDraggableObjects.push(new SVGDraggable.SVGObject(svgElement, index));
                }, this);
            }
        };
        return SVGController;
    }());
    SVGDraggable.SVGController = SVGController;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    var SVGObject = (function () {
        function SVGObject(element, id) {
            var _this = this;
            this.newX = 0;
            this.newY = 0;
            this.startMoveX = 169;
            this.mousedownHandler = function (event) { _this.mousedown(event); };
            this.mousemoveHandler = function (event) { _this.mousemove(event); };
            this.mouseupHandler = function (event) { _this.mouseup(event); };
            this.activeDrag = false;
            this.svgElement = element;
            this.id = id;
            this.registerEvents();
        }
        SVGObject.prototype.registerEvents = function () {
            this.svgElement.addEventListener('mousedown', this.mousedownHandler);
            window.addEventListener('mouseup', this.mouseupHandler);
        };
        SVGObject.prototype.mousedown = function (event) {
            this.activeDrag = true;
            var svgSvg = this.svgElement;
            var svgPoint = svgSvg.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            var startPoint = svgPoint.matrixTransform(svgSvg.getScreenCTM().inverse());
            this.startMoveX = startPoint.x;
            this.startMoveY = startPoint.y;
            if (!this.runOnce) {
                this.initialX = startPoint.x;
                this.initialY = startPoint.y;
                this.runOnce = true;
            }
            this.svgElement.addEventListener('mousemove', this.mousemoveHandler);
        };
        SVGObject.prototype.mouseup = function (event) {
            if (this.activeDrag) {
                this.svgElement.removeEventListener('mousemove', this.mousemoveHandler);
                this.newX = this.endX;
                this.newY = this.endY;
                this.activeDrag = false;
            }
        };
        SVGObject.prototype.mousemove = function (event) {
            var svg = event.currentTarget;
            var svgSvg = svg;
            var g = svg.querySelector('g');
            var pt = svgSvg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var svgCursorLocation = pt.matrixTransform(svgSvg.getScreenCTM().inverse());
            var mouseMoveX = svgCursorLocation.x - this.startMoveX;
            var mouseMoveY = svgCursorLocation.y - this.startMoveY;
            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svgSvg.createSVGTransform();
                newTransform.setTranslate(mouseMoveX, mouseMoveY);
                g.transform.baseVal.appendItem(newTransform);
            }
            else {
                g.transform.baseVal.getItem(0).setTranslate(mouseMoveX + this.newX, mouseMoveY + this.newY);
            }
            this.endX = mouseMoveX + this.newX;
            this.endY = mouseMoveY + this.newY;
        };
        return SVGObject;
    }());
    SVGDraggable.SVGObject = SVGObject;
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map