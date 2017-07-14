module SVGDraggable {
    export class Drag {
        svgObject: SVGObject;

        constructor() {
            this.svgObject = new SVGObject();
            this.registerEvents();
        }

        private registerEvents() {
            let svgDraggables: Array<HTMLElement> = Array.prototype.slice.call(document.getElementsByClassName('svg-draggable'));
            svgDraggables.forEach(function (svgDraggable, index) {
                svgDraggable.addEventListener('click', (event) => this.onSVGDraggableMousedown(event, this.svgObject));
            }, this);
        }
        private mousemoveHandle(event: MouseEvent): any {
            let xMouse = document.getElementById('xmouse');
            let yMouse = document.getElementById('ymouse');

            xMouse.innerHTML = event.clientX.toString();
            yMouse.innerHTML = event.clientY.toString();
        }
        // Sets the starting upperleft corner of SVG element to calculate assist with calculating drag
        private onSVGDraggableMousedown(event: MouseEvent, svgObject: SVGObject) {
            let svg = (<any>event.currentTarget).closest('svg');
            let offset = svg.getBoundingClientRect();

            let pt = svg.createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            let startPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

            svgObject.xDistance = startPoint.x - offset.left;
            svgObject.yDistance = startPoint.y - offset.top;

            (<HTMLElement>event.currentTarget).addEventListener('mousemove', this.onSVGDraggableMousemove.bind(svgObject));
        }
        private onSVGDraggableMousemove(event: MouseEvent) {
            let g = <any>event.currentTarget;
            let svg = g.closest('svg');
            let offset = svg.getBoundingClientRect();
            let pt = svg.createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            let svgCursorLocation = pt.matrixTransform(svg.getScreenCTM().inverse());

            // Use loc.x and loc.y here
            if (!g.transform.baseVal.length) {
                var newTransform = svg.createSVGTransform();
                newTransform.setTranslate(offset.left, offset.top);
                g.transform.baseVal.appendItem(newTransform);
            } else {
                g.transform.baseVal.getItem(0).setTranslate(svgCursorLocation.x - this.svgObject.xDistance, svgCursorLocation.y - this.svgObject.yDistance);
            }
        }
        private cursorPoint(event: MouseEvent, svg: any) {
            var pt = svg.createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        }
        private removeEventHandler(pressureSVG: HTMLElement, eventFunction: any) {
            pressureSVG.removeEventListener('mousemove', eventFunction);
        }
    }

    class SVGObject {
        xDistance: number;
        yDistance: number;
    }
}