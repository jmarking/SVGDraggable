var SVGDraggable;
(function (SVGDraggable) {
    var Drag = (function () {
        function Drag() {
            this.registerEvents();
        }
        Drag.prototype.registerEvents = function () {
            var _this = this;
            document.addEventListener('mousemove', function (event) { _this.mousemoveHandle(event); });
            document.addEventListener('click', function (event) { _this.documentClickHandle(event); });
            var polylines = Array.prototype.slice.call(document.getElementsByTagName('polyline'));
            polylines.forEach(function (polyline, index) {
                var _this = this;
                polyline.addEventListener('click', function (event) { _this.clickHandle(event); });
            }, this);
        };
        Drag.prototype.mousemoveHandle = function (event) {
            var xMouse = document.getElementById('xmouse');
            var yMouse = document.getElementById('ymouse');
            xMouse.innerHTML = event.clientX.toString();
            yMouse.innerHTML = event.clientY.toString();
        };
        Drag.prototype.clickHandle = function (event) {
            this.selectedPolyline = event.currentTarget;
            var objectId = this.selectedPolyline.parentNode.attributes['id'].value;
            document.querySelector("[href=\"#" + objectId + "\"][class=\"selected\"").style.display = 'block';
        };
        Drag.prototype.documentClickHandle = function (event) {
            var selectObject = event.currentTarget;
            if (this.selectedPolyline !== selectObject) {
                var selectedIndicatorsShowing = document.querySelector('[display="block"][class="selected"]');
            }
        };
        return Drag;
    }());
    SVGDraggable.Drag = Drag;
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map