module SVGDraggable {
    interface IDrag {
        justTesting: string;
    }
    export class Drag {
        svgObject: SVGObject;
        onMousemove = (event: MouseEvent) => { this.onSVGDraggableMousemove(event, this.svgObject); }
        runOnce: boolean = false;
        svgElement: SVGElement;

        constructor() {
            //this.svgObject = new SVGObject();
            //this.registerEvents();
        }

        private registerEvents() {
            let svgDraggables: Array<HTMLElement> = Array.prototype.slice.call(document.querySelectorAll('svg [draggable = "true"]'));
            svgDraggables.forEach(function (svgDraggable, index) {
                svgDraggable.addEventListener('mousedown', (event) => this.onSVGDraggableMousedown(event, this.svgObject));
            }, this);
            window.addEventListener('mouseup', (event) => { this.onMouseup(event) });
        }
        // Sets the starting upperleft corner of SVG element to calculate assist with calculating drag
        private onSVGDraggableMousedown(event: MouseEvent, svgObject: SVGObject) {
            let svg = this.svgElement = (<SVGElement>event.currentTarget);
            let svgSvg = <SVGSVGElement>svg;

            let svgPoint = svgSvg.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            let startPoint = svgPoint.matrixTransform(svgSvg.getScreenCTM().inverse());

            svgObject.startMoveX = startPoint.x;
            svgObject.startMoveY = startPoint.y;

            if (!this.runOnce) {
                svgObject.initialX = startPoint.x;
                svgObject.initialY = startPoint.y;
                this.runOnce = true;
            }

            svg.addEventListener('mousemove', this.onMousemove);
        }
        private onMouseup(event: MouseEvent) {
            if (this.svgElement) {
                this.svgElement.removeEventListener('mousemove', this.onMousemove);
                this.svgElement.setAttribute('hasMouseMoveEvent', 'false');

                this.svgObject.newX = this.svgObject.endX;
                this.svgObject.newY = this.svgObject.endY;
            }
            this.svgElement = undefined;
        }
        private onSVGDraggableMousemove(event: MouseEvent, svgObject: SVGObject) {
            let svg = (<SVGElement>event.currentTarget);
            let svgSvg = (<SVGSVGElement>svg);
            let g = <SVGGElement>svg.querySelector('g');

            let pt = svgSvg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            let svgCursorLocation = pt.matrixTransform(svgSvg.getScreenCTM().inverse());

            let mouseMoveX = svgCursorLocation.x - svgObject.startMoveX;
            let mouseMoveY = svgCursorLocation.y - svgObject.startMoveY;

            if (g.transform.baseVal.numberOfItems == 0) {
                var newTransform = svgSvg.createSVGTransform();
                newTransform.setTranslate(mouseMoveX, mouseMoveY);
                g.transform.baseVal.appendItem(newTransform);
            } else {
                g.transform.baseVal.getItem(0).setTranslate(mouseMoveX + svgObject.newX, mouseMoveY + svgObject.newY);
                svgObject.endX = mouseMoveX + svgObject.newX;
                svgObject.endY = mouseMoveY + svgObject.newY;
            }
        }
    }

    export class SVGObject {
        private readonly svgElement: SVGElement;
        newX: number = 0;
        newY: number = 0;
        endX: number;
        endY: number;
        startMoveX: number;
        startMoveY: number;
        initialX: number;
        initialY: number;

        constructor(element: SVGElement) {
            this.svgElement = element;
        }
    }
}
