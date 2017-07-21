module SVGDraggable {
    export class SVGController {
        svgDraggableObjects: Array<SVGObject>;

        constructor() {
            this.loadSvgDraggables();
        }

        private loadSvgDraggables() {
            let svgElements: Array<SVGElement> = Array.prototype.slice.call(document.querySelectorAll('svg [draggable="true"]'));
            if (svgElements.length) {
                this.svgDraggableObjects = new Array<SVGObject>();
                svgElements.forEach(function (svgElement: SVGElement, index: number) {
                    this.svgDraggableObjects.push(new SVGObject(svgElement, index));
                }, this);
            }
        }
    }
}
