var SVGDraggable;
(function (SVGDraggable) {
    var Drag = (function () {
        function Drag() {
            this.svgObject = new SVGObject();
            this.registerEvents();
        }
        Drag.prototype.registerEvents = function () {
            var svgDraggables = Array.prototype.slice.call(document.getElementsByClassName('svg-draggable'));
            svgDraggables.forEach(function (svgDraggable, index) {
                var _this = this;
                svgDraggable.addEventListener('click', function (event) { return _this.onSVGDraggableMousedown(event, _this.svgObject); });
            }, this);
        };
        Drag.prototype.mousemoveHandle = function (event) {
            var xMouse = document.getElementById('xmouse');
            var yMouse = document.getElementById('ymouse');
            xMouse.innerHTML = event.clientX.toString();
            yMouse.innerHTML = event.clientY.toString();
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
            event.currentTarget.addEventListener('mousemove', this.onSVGDraggableMousemove.bind(svgObject));
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
            if (!g.transform.baseVal.length) {
                var newTransform = svg.createSVGTransform();
                newTransform.setTranslate(offset.left, offset.top);
                g.transform.baseVal.appendItem(newTransform);
            }
            else {
                g.transform.baseVal.getItem(0).setTranslate(svgCursorLocation.x - this.svgObject.xDistance, svgCursorLocation.y - this.svgObject.yDistance);
            }
        };
        Drag.prototype.cursorPoint = function (event, svg) {
            var pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        };
        Drag.prototype.removeEventHandler = function (pressureSVG, eventFunction) {
            pressureSVG.removeEventListener('mousemove', eventFunction);
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