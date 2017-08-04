module SVGDraggable {
    export class SVGObject {
        private readonly id: number;
        private readonly svgElement: SVGElement;
        private readonly parentElement: Node;
        private newX: number = 0;
        private newY: number = 0;
        private endX: number;
        private endY: number;
        private startMoveX: number = 169;
        private startMoveY: number;
        private initialX: number;
        private initialY: number;
        private runOnce: boolean;
        private mousedownHandler = (event: MouseEvent) => { this.mousedown(event) };
        private mousemoveHandler = (event: MouseEvent) => { this.mousemove(event) };
        private mouseupHandler = (event: MouseEvent) => { this.mouseup(event) };
        private activeDrag: boolean = false;

        constructor(element: SVGElement, id: number) {
            this.svgElement = element;
            let blah = element.ownerSVGElement;
            this.parentElement = element.closest('svg[droppable]');
            this.id = id;
            this.registerEvents();
        }

        private registerEvents() {
            this.svgElement.addEventListener('mousedown', this.mousedownHandler);
            window.addEventListener('mouseup', this.mouseupHandler);
        }
        private mousedown(event: MouseEvent) {
            let svgElement: SVGElement = <SVGElement>event.currentTarget;
            svgElement.ownerSVGElement.appendChild(svgElement);
            this.activeDrag = true;
            let svgSvg = <SVGSVGElement>this.svgElement;

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
        private mouseup(event: MouseEvent) {
            if (this.activeDrag) {
                this.svgElement.removeEventListener('mousemove', this.mousemoveHandler);
                this.newX = this.endX;
                this.newY = this.endY;
                this.activeDrag = false;
            }
        }
        private mousemove(event: MouseEvent) {
            let svg = (<SVGElement>event.currentTarget);
            let svgSvg = (<SVGSVGElement>svg);
            let g = <SVGGElement>svg.querySelector('g');

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
            } else {
                g.transform.baseVal.getItem(0).setTranslate(mouseMoveX + this.newX, mouseMoveY + this.newY);
            }

            this.endX = mouseMoveX + this.newX;
            this.endY = mouseMoveY + this.newY;
        }
    }
}
