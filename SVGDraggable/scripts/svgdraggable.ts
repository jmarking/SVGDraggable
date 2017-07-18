module SVGDraggable {
    export class Drag {
        svgObject: SVGObject;
        onMousemove = (event: MouseEvent) => { this.onSVGDraggableMousemove(event, this.svgObject); }
        runOnce: boolean = false;

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

            let pt = (<SVGSVGElement>svg).createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            let startPoint = pt.matrixTransform((<SVGSVGElement>svg).getScreenCTM().inverse());

            svgObject.startMoveX = startPoint.x;
            svgObject.startMoveY = startPoint.y;

            if (!this.runOnce) {
                svgObject.initialX = startPoint.x;
                svgObject.initialY = startPoint.y;
                this.runOnce = true;
            }

            (<HTMLElement>event.currentTarget).addEventListener('mousemove', this.onMousemove);
            (<SVGElement>event.currentTarget).setAttribute('hasMouseMoveEvent', 'true');
        }
        private onMouseup(event: MouseEvent) {
            let svgDraggables = document.querySelector('[class="svg-draggable"][hasMouseMoveEvent="true"]');
            if (svgDraggables) {
                svgDraggables.removeEventListener('mousemove', this.onMousemove);
                svgDraggables.setAttribute('hasMouseMoveEvent', 'false');

                this.svgObject.newX = this.svgObject.endX;
                this.svgObject.newY = this.svgObject.endY;
            }
        }
        private onSVGDraggableMousemove(event: MouseEvent, svgObject: SVGObject) {
            let g = <any>event.currentTarget;
            let svg = g.closest('svg');

            let pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            let svgCursorLocation = pt.matrixTransform(svg.getScreenCTM().inverse());

            let mouseMoveX = svgCursorLocation.x - svgObject.startMoveX;
            let mouseMoveY = svgCursorLocation.y - svgObject.startMoveY;

            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svg.createSVGTransform();
                newTransform.setTranslate(mouseMoveX, mouseMoveY);
                g.transform.baseVal.appendItem(newTransform);
            } else {
                g.transform.baseVal.getItem(0).setTranslate(mouseMoveX + svgObject.newX, mouseMoveY + svgObject.newY);
                svgObject.endX = mouseMoveX + svgObject.newX;
                svgObject.endY = mouseMoveY + svgObject.newY;
            }
        }
    }

    class SVGObject {
        newX: number = 0;
        newY: number = 0;
        endX: number;
        endY: number;
        startMoveX: number;
        startMoveY: number;
        initialX: number;
        initialY: number;
    }
}