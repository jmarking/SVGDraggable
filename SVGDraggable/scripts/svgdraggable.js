var SVGDraggable;
(function (SVGDraggable) {
    var Drag = (function () {
        function Drag() {
            var _this = this;
            this.onMousemove = function (event) { _this.onSVGDraggableMousemove(event, _this.svgObject); };
            this.runOnce = false;
            this.svgObject = new SVGObject();
            this.registerEvents();
        }
        Drag.prototype.registerEvents = function () {
            var _this = this;
            var svgDraggables = Array.prototype.slice.call(document.getElementsByClassName('svg-draggable'));
            svgDraggables.forEach(function (svgDraggable, index) {
                var _this = this;
                svgDraggable.addEventListener('mousedown', function (event) { return _this.onSVGDraggableMousedown(event, _this.svgObject); });
            }, this);
            window.addEventListener('mouseup', function (event) { _this.onMouseup(event); });
        };
        // Sets the starting upperleft corner of SVG element to calculate assist with calculating drag
        Drag.prototype.onSVGDraggableMousedown = function (event, svgObject) {
            var svg = event.currentTarget.closest('svg');
            var pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var startPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
            svgObject.startMoveX = startPoint.x;
            svgObject.startMoveY = startPoint.y;
            if (!this.runOnce) {
                svgObject.initialX = startPoint.x;
                svgObject.initialY = startPoint.y;
                this.runOnce = true;
            }
            event.currentTarget.addEventListener('mousemove', this.onMousemove);
            event.currentTarget.setAttribute('hasMouseMoveEvent', 'true');
        };
        Drag.prototype.onMouseup = function (event) {
            var svgDraggables = document.querySelector('[class="svg-draggable"][hasMouseMoveEvent="true"]');
            if (svgDraggables) {
                svgDraggables.removeEventListener('mousemove', this.onMousemove);
                svgDraggables.setAttribute('hasMouseMoveEvent', 'false');
                this.svgObject.newX = this.svgObject.endX;
                this.svgObject.newY = this.svgObject.endY;
            }
        };
        Drag.prototype.onSVGDraggableMousemove = function (event, svgObject) {
            var g = event.currentTarget;
            var svg = g.closest('svg');
            var pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var svgCursorLocation = pt.matrixTransform(svg.getScreenCTM().inverse());
            var mouseMoveX = svgCursorLocation.x - svgObject.startMoveX;
            var mouseMoveY = svgCursorLocation.y - svgObject.startMoveY;
            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svg.createSVGTransform();
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
        function SVGObject() {
            this.newX = 0;
            this.newY = 0;
        }
        return SVGObject;
    }());
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map