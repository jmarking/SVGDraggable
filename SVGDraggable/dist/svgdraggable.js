var SVGDraggable;
(function (SVGDraggable) {
    var EventHandler = (function () {
        function EventHandler() {
        }
        return EventHandler;
    }());
})(SVGDraggable || (SVGDraggable = {}));
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
    var ToolbarController = (function () {
        function ToolbarController(svgCanvas) {
            var _this = this;
            this.selected = 'selected';
            this.onClick = function (event) { _this.click(event); };
            this.svgCanvas = svgCanvas;
            var mocks = {};
            this.toolbarButtons = Array.prototype.slice.call(document.getElementsByClassName('toolbar-btn'));
            this.loadEvents();
        }
        ToolbarController.prototype.loadEvents = function () {
            this.toolbarButtons.forEach(function (button, index) {
                button.addEventListener('click', this.onClick);
            }, this);
        };
        ToolbarController.prototype.click = function (event) {
            var selectedToolbarButton = event.currentTarget;
            this.toolbarButtons.forEach(function (button, index) {
                if (selectedToolbarButton !== button) {
                    if (button.hasAttribute(this.selected)) {
                        button.removeAttribute(this.selected);
                    }
                }
            }, this);
            if (selectedToolbarButton.hasAttribute(this.selected)) {
                selectedToolbarButton.removeAttribute(this.selected);
                this.polyline.removeEvents();
            }
            else {
                this.polyline = new SVGDraggable.Polyline(this.svgCanvas);
                selectedToolbarButton.setAttribute(this.selected, '');
            }
        };
        return ToolbarController;
    }());
    SVGDraggable.ToolbarController = ToolbarController;
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
            var blah = element.ownerSVGElement;
            this.parentElement = element.closest('svg[droppable]');
            this.id = id;
            this.registerEvents();
        }
        SVGObject.prototype.registerEvents = function () {
            this.svgElement.addEventListener('mousedown', this.mousedownHandler);
            window.addEventListener('mouseup', this.mouseupHandler);
        };
        SVGObject.prototype.mousedown = function (event) {
            if (event.currentTarget instanceof SVGElement && event.currentTarget.hasAttribute('test')) {
                var draggable = event.currentTarget.getAttribute('test');
                console.log(draggable);
            }
            var svgElement = event.currentTarget;
            svgElement.ownerSVGElement.appendChild(svgElement);
            //this.parentElement.appendChild(this.svgElement);
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
var SVGDraggable;
(function (SVGDraggable) {
    var ScriptLoader = (function () {
        function ScriptLoader(files) {
            var _this = this;
            this.log = function (t) {
                console.log("ScriptLoader: " + t);
            };
            this.withNoCache = function (filename) {
                if (filename.indexOf("?") === -1)
                    filename += "?no_cache=" + new Date().getTime();
                else
                    filename += "&no_cache=" + new Date().getTime();
                return filename;
            };
            this.loadStyle = function (filename) {
                // HTMLLinkElement
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = _this.withNoCache(filename);
                _this.log('Loading style ' + filename);
                link.onload = function () {
                    _this.log('Loaded style "' + filename + '".');
                };
                link.onerror = function () {
                    _this.log('Error loading style "' + filename + '".');
                };
                _this.m_head.appendChild(link);
            };
            this.loadScript = function (i) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = _this.withNoCache(_this.m_js_files[i]);
                var loadNextScript = function () {
                    if (i + 1 < _this.m_js_files.length) {
                        _this.loadScript(i + 1);
                    }
                };
                script.onload = function () {
                    _this.log('Loaded script "' + _this.m_js_files[i] + '".');
                    loadNextScript();
                };
                script.onerror = function () {
                    _this.log('Error loading script "' + _this.m_js_files[i] + '".');
                    loadNextScript();
                };
                _this.log('Loading script "' + _this.m_js_files[i] + '".');
                _this.m_head.appendChild(script);
            };
            this.loadFiles = function () {
                // this.log(this.m_css_files);
                // this.log(this.m_js_files);
                for (var i = 0; i < _this.m_css_files.length; ++i)
                    _this.loadStyle(_this.m_css_files[i]);
                _this.loadScript(0);
            };
            this.m_js_files = [];
            this.m_css_files = [];
            this.m_head = document.getElementsByTagName("head")[0];
            // this.m_head = document.head; // IE9+ only
            function endsWith(str, suffix) {
                if (str === null || suffix === null)
                    return false;
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            }
            for (var i = 0; i < files.length; ++i) {
                if (endsWith(files[i], ".css")) {
                    this.m_css_files.push(files[i]);
                }
                else if (endsWith(files[i], ".js")) {
                    this.m_js_files.push(files[i]);
                }
                else
                    this.log('Error unknown filetype "' + files[i] + '".');
            }
        }
        return ScriptLoader;
    }());
    SVGDraggable.ScriptLoader = ScriptLoader;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    var Polyline = (function () {
        function Polyline(svgCanvas) {
            var _this = this;
            this.startNewLine = true;
            this.onClick = function (event) { _this.click(event); };
            this.onPointerMove = function (event) { _this.pointerMove(event); };
            this.onContextMenu = function (event) { _this.contextMenu(event); };
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }
        Polyline.prototype.removeEvents = function () {
            this.svgCanvas.removeEventListener('click', this.onClick);
            this.svgCanvas.removeEventListener('contextmenu', this.onContextMenu);
        };
        Polyline.prototype.loadEvents = function () {
            this.svgCanvas.addEventListener('click', this.onClick);
            this.svgCanvas.addEventListener('contextmenu', this.onContextMenu);
        };
        Polyline.prototype.pointerMove = function (event) {
        };
        Polyline.prototype.contextMenu = function (event) {
            event.preventDefault();
            this.startNewLine = true;
        };
        Polyline.prototype.click = function (event) {
            if (!this.polyline || this.startNewLine) {
                var svg = this.createSVGElement();
                this.createGElement();
                this.createPolylineElement(event);
                var rect = this.createRectElement(event);
                this.g.appendChild(this.polyline);
                this.g.appendChild(rect);
                svg.appendChild(this.g);
                this.svgCanvas.appendChild(svg);
                this.startNewLine = false;
            }
            else {
                this.addPoint(event);
                this.g.appendChild(this.createRectElement(event));
            }
        };
        Polyline.prototype.createSVGElement = function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('draggable', 'true');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('viewBox', "0 0 " + this.svgCanvas.width.baseVal.value + " " + this.svgCanvas.height.baseVal.value);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            return svg;
        };
        Polyline.prototype.createPolylineElement = function (event) {
            this.polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            this.polyline.points.appendItem(this.getSVGPoint(event));
            this.polyline.setAttribute('stroke', 'black');
            this.polyline.setAttribute('stroke-width', '4');
            this.polyline.setAttribute('fill', 'white');
            this.polyline.setAttribute('fill-opacity', '0');
        };
        Polyline.prototype.createGElement = function () {
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        };
        Polyline.prototype.createRectElement = function (event) {
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            var startPoint = this.getSVGPoint(event);
            rect.setAttribute('height', '10');
            rect.setAttribute('width', '10');
            rect.setAttribute('x', "" + (startPoint.x - 5));
            rect.setAttribute('y', "" + (startPoint.y - 5));
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('stroke-width', '3');
            rect.setAttribute('fill', 'white');
            return rect;
        };
        Polyline.prototype.getSVGPoint = function (event) {
            var svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        };
        Polyline.prototype.addPoint = function (event) {
            this.polyline.points.appendItem(this.getSVGPoint(event));
        };
        return Polyline;
    }());
    SVGDraggable.Polyline = Polyline;
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map