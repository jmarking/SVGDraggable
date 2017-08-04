var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var SVGDraggable;
(function (SVGDraggable) {
    class EventHandler {
    }
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class SVGController {
        constructor() {
            this.loadSvgDraggables();
        }
        loadSvgDraggables() {
            let svgElements = Array.prototype.slice.call(document.querySelectorAll('svg [draggable="true"]'));
            if (svgElements.length) {
                this.svgDraggableObjects = new Array();
                svgElements.forEach(function (svgElement, index) {
                    this.svgDraggableObjects.push(new SVGDraggable.SVGObject(svgElement, index));
                }, this);
            }
        }
    }
    SVGDraggable.SVGController = SVGController;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class ToolbarController {
        constructor(svgCanvas) {
            this.selected = 'selected';
            this.onClick = (event) => { this.click(event); };
            this.svgCanvas = svgCanvas;
            let mocks = {};
            this.toolbarButtons = Array.prototype.slice.call(document.getElementsByClassName('toolbar-btn'));
            this.loadEvents();
        }
        loadEvents() {
            this.toolbarButtons.forEach(function (button, index) {
                button.addEventListener('click', this.onClick);
            }, this);
        }
        click(event) {
            let selectedToolbarButton = event.currentTarget;
            let buttonType = selectedToolbarButton.getAttribute('data-button-type');
            this.toolbarButtons.forEach(function (button, index) {
                if (selectedToolbarButton !== button) {
                    if (button.hasAttribute(this.selected)) {
                        button.removeAttribute(this.selected);
                        this.buttonOff(button.getAttribute('data-button-type'));
                    }
                }
            }, this);
            if (selectedToolbarButton.hasAttribute(this.selected)) {
                selectedToolbarButton.removeAttribute(this.selected);
                this.buttonOff(buttonType);
            }
            else {
                this.buttonOn(buttonType);
                selectedToolbarButton.setAttribute(this.selected, '');
            }
        }
        buttonOff(buttonType) {
            switch (buttonType) {
                case 'polyline':
                    this.polyline.removeEvents();
                    break;
                case 'pressuregauge':
                    this.gauge.removeEvents();
                    break;
                case 'circle':
                    this.circle.removeEvents();
                    break;
                default:
                    break;
            }
        }
        buttonOn(buttonType) {
            switch (buttonType) {
                case 'polyline':
                    this.polyline = new SVGDraggable.Polyline(this.svgCanvas);
                    break;
                case 'pressuregauge':
                    this.gauge = new SVGDraggable.Gauge(this.svgCanvas);
                    break;
                case 'circle':
                    this.circle = new SVGDraggable.Circle(this.svgCanvas);
                    break;
                default:
                    break;
            }
        }
    }
    SVGDraggable.ToolbarController = ToolbarController;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class SVGObject {
        constructor(element, id) {
            this.newX = 0;
            this.newY = 0;
            this.startMoveX = 169;
            this.mousedownHandler = (event) => { this.mousedown(event); };
            this.mousemoveHandler = (event) => { this.mousemove(event); };
            this.mouseupHandler = (event) => { this.mouseup(event); };
            this.activeDrag = false;
            this.svgElement = element;
            let blah = element.ownerSVGElement;
            this.parentElement = element.closest('svg[droppable]');
            this.id = id;
            this.registerEvents();
        }
        registerEvents() {
            this.svgElement.addEventListener('mousedown', this.mousedownHandler);
            window.addEventListener('mouseup', this.mouseupHandler);
        }
        mousedown(event) {
            let svgElement = event.currentTarget;
            svgElement.ownerSVGElement.appendChild(svgElement);
            this.activeDrag = true;
            let svgSvg = this.svgElement;
            let svgPoint = svgSvg.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            let startPoint = svgPoint.matrixTransform(svgSvg.getScreenCTM().inverse());
            this.startMoveX = startPoint.x;
            this.startMoveY = startPoint.y;
            if (!this.runOnce) {
                this.initialX = startPoint.x;
                this.initialY = startPoint.y;
                this.runOnce = true;
            }
            this.svgElement.addEventListener('mousemove', this.mousemoveHandler);
        }
        mouseup(event) {
            if (this.activeDrag) {
                this.svgElement.removeEventListener('mousemove', this.mousemoveHandler);
                this.newX = this.endX;
                this.newY = this.endY;
                this.activeDrag = false;
            }
        }
        mousemove(event) {
            let svg = event.currentTarget;
            let svgSvg = svg;
            let g = svg.querySelector('g');
            let pt = svgSvg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            let svgCursorLocation = pt.matrixTransform(svgSvg.getScreenCTM().inverse());
            let mouseMoveX = svgCursorLocation.x - this.startMoveX;
            let mouseMoveY = svgCursorLocation.y - this.startMoveY;
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
        }
    }
    SVGDraggable.SVGObject = SVGObject;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class Circle {
        constructor(svgCanvas) {
            this.circles = new Array();
            this.onPointerDown = (event) => { this.pointerDown(event); };
            this.onPointerUp = (event) => { this.pointerUp(event); };
            this.onPointerMove = (event) => { this.pointerMove(event); };
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }
        removeEvents() {
            this.svgCanvas.removeEventListener('pointerdown', this.onPointerDown);
            this.circles.forEach(function (circle, index) {
                new SVGDraggable.SVGObject(circle.ownerSVGElement, index);
            });
        }
        loadEvents() {
            this.svgCanvas.addEventListener('pointerdown', this.onPointerDown);
        }
        pointerDown(event) {
            let svg = this.createSVGElement();
            let g = this.createGElement();
            this.createCircle(event);
            g.appendChild(this.circle);
            svg.appendChild(g);
            this.svgCanvas.appendChild(svg);
            this.svgCanvas.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp);
        }
        pointerUp(event) {
            this.svgCanvas.removeEventListener('pointermove', this.onPointerMove);
            window.removeEventListener('pointerup', this.onPointerUp);
        }
        pointerMove(event) {
            let radius = this.calculateRadius(event);
            this.circle.setAttribute('r', radius.toString());
        }
        calculateRadius(event) {
            let mousePoint = this.getSVGPoint(event);
            let xDifferenceSquared = Math.pow(mousePoint.x - this.cx, 2);
            let yDifferenceSquared = Math.pow(mousePoint.y - this.cy, 2);
            let radius = Math.sqrt((xDifferenceSquared + yDifferenceSquared));
            return radius;
        }
        createCircle(event) {
            let point = this.getSVGPoint(event);
            let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', `${point.x}`);
            circle.setAttribute('cy', `${point.y}`);
            circle.setAttribute('r', '0');
            circle.setAttribute('fill', 'white');
            circle.setAttribute('stroke', 'red');
            circle.setAttribute('stroke-width', '3');
            this.cx = point.x;
            this.cy = point.y;
            this.circle = circle;
            this.circles.push(circle);
        }
        createSVGElement() {
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('draggable', 'true');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('viewBox', `0 0 ${this.svgCanvas.width.baseVal.value} ${this.svgCanvas.height.baseVal.value}`);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            return svg;
        }
        createGElement() {
            return document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        getSVGPoint(event) {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }
    }
    SVGDraggable.Circle = Circle;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class Polyline {
        constructor(svgCanvas) {
            this.polylines = new Array();
            this.startNewLine = true;
            this.onClick = (event) => { this.click(event); };
            this.onPointerMove = (event) => { this.pointerMove(event); };
            this.onContextMenu = (event) => { this.contextMenu(event); };
            this.onPointerDown = (event) => { this.pointerDown(event); };
            this.onPointerUp = (event) => { this.pointerUp(event); };
            this.rect = new SVGDraggable.Rect();
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }
        removeEvents() {
            this.svgCanvas.removeEventListener('click', this.onClick);
            this.svgCanvas.removeEventListener('contextmenu', this.onContextMenu);
            //this.polylines.forEach(function (polyline, index) {
            //    new SVGObject(polyline.ownerSVGElement, index);
            //});
        }
        loadEvents() {
            this.svgCanvas.addEventListener('click', this.onClick);
            this.svgCanvas.addEventListener('contextmenu', this.onContextMenu);
        }
        pointerMove(event) {
            let transformValues = this.selectedRect.getCTM();
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            let startPoint = svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
            let newX = startPoint.x - transformValues.e;
            let newY = startPoint.y - transformValues.f;
            this.selectedSVGPoint.x = newX;
            this.selectedSVGPoint.y = newY;
            this.selectedRect.setAttribute('x', (newX - 5).toString());
            this.selectedRect.setAttribute('y', (newY - 5).toString());
        }
        pointerDown(event) {
            this.selectedRect = event.currentTarget;
            let parentSVG = this.selectedRect.ownerSVGElement;
            this.polyline = parentSVG.getElementsByTagName('polyline')[0];
            for (var i = 0; i < this.polyline.points.numberOfItems; i++) {
                var point = this.polyline.points.getItem(i);
                if (point.x == (Number(this.selectedRect.getAttribute('x')) + 5) && point.y == (Number(this.selectedRect.getAttribute('y')) + 5)) {
                    this.selectedSVGPoint = point;
                    break;
                }
                ;
            }
            ;
            window.addEventListener('pointerup', this.onPointerUp);
            this.svgCanvas.addEventListener('pointermove', this.onPointerMove);
        }
        pointerUp(event) {
            this.svgCanvas.removeEventListener('pointermove', this.onPointerMove);
        }
        contextMenu(event) {
            event.preventDefault();
            this.startNewLine = true;
        }
        click(event) {
            let svgPoint = this.getSVGPoint(event);
            //let rect = this.rect.createRectElement(svgPoint.x, svgPoint.y);
            if (!this.polyline || this.startNewLine) {
                let svg = this.createSVGElement();
                this.createGElement();
                this.createPolylineElement(event);
                let rect = this.createRectElement(event);
                this.g.appendChild(this.polyline);
                this.g.appendChild(rect);
                svg.appendChild(this.g);
                this.svgCanvas.appendChild(svg);
                this.startNewLine = false;
                this.polylines.push(this.polyline);
            }
            else {
                this.addPoint(event);
                this.g.appendChild(this.createRectElement(event));
            }
        }
        createSVGElement() {
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('draggable', 'false');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('viewBox', `0 0 ${this.svgCanvas.width.baseVal.value} ${this.svgCanvas.height.baseVal.value}`);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            return svg;
        }
        createPolylineElement(event) {
            this.polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            this.polyline.points.appendItem(this.getSVGPoint(event));
            this.polyline.setAttribute('stroke', 'black');
            this.polyline.setAttribute('stroke-width', '4');
            this.polyline.setAttribute('fill', 'white');
            this.polyline.setAttribute('fill-opacity', '0');
        }
        createGElement() {
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        createDefsElement() {
            return document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        }
        createUseElement(event) {
            let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            let svgPoint = this.getSVGPoint(event);
            use.setAttribute('x', `${svgPoint.x - 5}`);
            use.setAttribute('y', `${svgPoint.y - 5}`);
            return use;
        }
        createRectElement(event) {
            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            let svgPoint = this.getSVGPoint(event);
            rect.classList.add('rectNode');
            rect.setAttribute('height', '10');
            rect.setAttribute('width', '10');
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('stroke-width', '3');
            rect.setAttribute('fill', 'white');
            rect.setAttribute('x', `${svgPoint.x - 5}`);
            rect.setAttribute('y', `${svgPoint.y - 5}`);
            rect.addEventListener('pointerdown', this.onPointerDown);
            return rect;
        }
        getRectAttributes(x, y) {
            let rectAttributes = new SVGDraggable.RectAttributes();
            rectAttributes.id = 'rectNode';
            rectAttributes.height = '10';
            rectAttributes.width = '10';
            rectAttributes.stroke = 'black';
            rectAttributes.strokeWidth = '3';
            rectAttributes.fill = 'white';
            rectAttributes.x = x;
            rectAttributes.y = y;
            return rectAttributes;
        }
        getSVGPoint(event) {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }
        addPoint(event) {
            this.polyline.points.appendItem(this.getSVGPoint(event));
        }
    }
    SVGDraggable.Polyline = Polyline;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class Rect {
        createRectElement(attributes) {
            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('id', attributes.id);
            rect.setAttribute('height', attributes.height);
            rect.setAttribute('width', attributes.width);
            rect.setAttribute('stroke', attributes.stroke);
            rect.setAttribute('stroke-width', attributes.strokeWidth);
            rect.setAttribute('fill', attributes.fill);
            rect.setAttribute('x', `${attributes.x}`);
            rect.setAttribute('y', `${attributes.y}`);
            return rect;
        }
    }
    SVGDraggable.Rect = Rect;
    class RectAttributes {
    }
    SVGDraggable.RectAttributes = RectAttributes;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class ScriptLoader {
        constructor(files) {
            this.log = (t) => {
                console.log("ScriptLoader: " + t);
            };
            this.withNoCache = (filename) => {
                if (filename.indexOf("?") === -1)
                    filename += "?no_cache=" + new Date().getTime();
                else
                    filename += "&no_cache=" + new Date().getTime();
                return filename;
            };
            this.loadStyle = (filename) => {
                // HTMLLinkElement
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = this.withNoCache(filename);
                this.log('Loading style ' + filename);
                link.onload = () => {
                    this.log('Loaded style "' + filename + '".');
                };
                link.onerror = () => {
                    this.log('Error loading style "' + filename + '".');
                };
                this.m_head.appendChild(link);
            };
            this.loadScript = (i) => {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.withNoCache(this.m_js_files[i]);
                var loadNextScript = () => {
                    if (i + 1 < this.m_js_files.length) {
                        this.loadScript(i + 1);
                    }
                };
                script.onload = () => {
                    this.log('Loaded script "' + this.m_js_files[i] + '".');
                    loadNextScript();
                };
                script.onerror = () => {
                    this.log('Error loading script "' + this.m_js_files[i] + '".');
                    loadNextScript();
                };
                this.log('Loading script "' + this.m_js_files[i] + '".');
                this.m_head.appendChild(script);
            };
            this.loadFiles = () => {
                // this.log(this.m_css_files);
                // this.log(this.m_js_files);
                for (var i = 0; i < this.m_css_files.length; ++i)
                    this.loadStyle(this.m_css_files[i]);
                this.loadScript(0);
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
    }
    SVGDraggable.ScriptLoader = ScriptLoader;
})(SVGDraggable || (SVGDraggable = {}));
var SVGDraggable;
(function (SVGDraggable) {
    class Gauge {
        constructor(svgCanvas) {
            this.onPointerDown = (event) => { this.pointerDown(event); };
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }
        removeEvents() {
            this.svgCanvas.removeEventListener('pointerdown', this.onPointerDown);
        }
        loadEvents() {
            this.svgCanvas.addEventListener('pointerdown', this.onPointerDown);
        }
        pointerDown(event) {
            this.getSvgAsync(event);
        }
        getSvgAsync(event) {
            return __awaiter(this, void 0, void 0, function* () {
                let response = yield fetch('http://localhost:6929/images/pressuregauge.svg');
                let text = yield response.text();
                let doc = new DOMParser().parseFromString(text, 'image/svg+xml');
                let svg = doc.getElementsByTagName('svg');
                let svgPoint = this.getSVGPoint(event);
                let svgXSize = svg[0].viewBox.baseVal.width;
                let svgYSize = svg[0].viewBox.baseVal.height;
                svg[0].setAttribute('viewBox', `0 0 ${this.svgCanvas.clientWidth} ${this.svgCanvas.clientHeight}`);
                svg[0].setAttribute('preserveAspectRatio', 'xMinYMin meet');
                let g = svg[0].getElementsByTagName('g')[0];
                g.setAttribute('transform', `translate(${svgPoint.x - (svgXSize / 2)},${svgPoint.y - (svgYSize / 2)})`);
                this.svgCanvas.appendChild(doc.childNodes[0]);
            });
        }
        getSVGPoint(event) {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }
    }
    SVGDraggable.Gauge = Gauge;
})(SVGDraggable || (SVGDraggable = {}));
//# sourceMappingURL=svgdraggable.js.map