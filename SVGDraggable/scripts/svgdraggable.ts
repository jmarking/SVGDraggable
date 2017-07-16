module SVGDraggable {
    export class Drag {
        svgObject: SVGObject;
        onMousemove = (event: MouseEvent) => { this.onSVGDraggableMousemove(event); }

        constructor() {
            this.svgObject = new SVGObject();
            this.registerEvents();
        }

        private registerEvents() {
            let svgDraggables: Array<HTMLElement> = Array.prototype.slice.call(document.getElementsByClassName('svg-draggable'));
            svgDraggables.forEach(function (svgDraggable, index) {
                svgDraggable.addEventListener('mousedown', (event) => this.onSVGDraggableMousedown(event, this.svgObject));
            }, this);
            window.addEventListener('mouseup', (event) => { this.onMouseup(event) });
        }
        // Sets the starting upperleft corner of SVG element to calculate assist with calculating drag
        private onSVGDraggableMousedown(event: MouseEvent, svgObject: SVGObject) {
            let svg = (<SVGElement>event.currentTarget).closest('svg');
            let offset = svg.getBoundingClientRect();

            let pt = (<SVGSVGElement>svg).createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            let startPoint = pt.matrixTransform((<SVGSVGElement>svg).getScreenCTM().inverse());

            svgObject.xDistance = startPoint.x - offset.left;
            svgObject.yDistance = startPoint.y - offset.top;

            (<HTMLElement>event.currentTarget).addEventListener('mousemove', this.onMousemove);
            (<SVGElement>event.currentTarget).setAttribute('hasMouseMoveEvent', 'true');
        }
        private onMouseup(event: MouseEvent) {
            let svgDraggables = document.querySelector('[class="svg-draggable"][hasMouseMoveEvent="true"]');
            if (svgDraggables) {
                svgDraggables.removeEventListener('mousemove', this.onMousemove);
                svgDraggables.setAttribute('hasMouseMoveEvent', 'false');
            }
        }
        private onSVGDraggableMousemove(event: MouseEvent) {
            let g = <any>event.currentTarget;
            let svg = g.closest('svg');
            let offset = svg.getBoundingClientRect();

            let pt = svg.createSVGPoint();
            pt.x = event.clientX; pt.y = event.clientY;
            let svgCursorLocation = pt.matrixTransform(svg.getScreenCTM().inverse());

            // Use loc.x and loc.y here
            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svg.createSVGTransform();
                newTransform.setTranslate(offset.left, offset.top);
                g.transform.baseVal.appendItem(newTransform);
            } else {
                g.transform.baseVal.getItem(0).setTranslate(svgCursorLocation.x - this.svgObject.xDistance, svgCursorLocation.y - this.svgObject.yDistance);
            }
        }
    }

    class SVGObject {
        xDistance: number;
        yDistance: number;
    }
}