var SVGDraggable;
(function (SVGDraggable) {
    var Drag = (function () {
        function Drag() {
            var _this = this;
            this.onMousemove = function (event) { _this.onSVGDraggableMousemove(event); };
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
            var offset = svg.getBoundingClientRect();
            var pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var startPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
            svgObject.xDistance = startPoint.x - offset.left;
            svgObject.yDistance = startPoint.y - offset.top;
            event.currentTarget.addEventListener('mousemove', this.onMousemove);
            event.currentTarget.setAttribute('hasMouseMoveEvent', 'true');
        };
        Drag.prototype.onMouseup = function (event) {
            var svgDraggables = document.querySelector('[class="svg-draggable"][hasMouseMoveEvent="true"]');
            if (svgDraggables) {
                svgDraggables.removeEventListener('mousemove', this.onMousemove);
                svgDraggables.setAttribute('hasMouseMoveEvent', 'false');
            }
        };
        Drag.prototype.onSVGDraggableMousemove = function (event) {
            var g = event.currentTarget;
            var svg = g.closest('svg');
            var offset = svg.getBoundingClientRect();
            var pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            var svgCursorLocation = pt.matrixTransform(svg.getScreenCTM().inverse());
            // Use loc.x and loc.y here
            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svg.createSVGTransform();
                newTransform.setTranslate(0, 0);
                g.transform.baseVal.appendItem(newTransform);
            }
            else {
                g.transform.baseVal.getItem(0).setTranslate(svgCursorLocation.x - this.svgObject.xDistance, svgCursorLocation.y - this.svgObject.yDistance);
            }
        };
        return Drag;
    }());
    SVGDraggable.Drag = Drag;
    var SVGObject = (function () {
        function SVGObject() {
        }
        return SVGObject;
    }());
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map