module SVGDraw {
    export class SVGController {
        svgObjects: Array<SVGObject>;

        constructor() {
            this.loadSvgObjects();
        }

        private loadSvgObjects() {
            let svgElements: Array<SVGElement> = Array.prototype.slice.call(document.querySelectorAll('svg [draggable="true"]'));
            if (svgElements.length) {
                this.svgObjects = new Array<SVGObject>();
                svgElements.forEach(function (svgElement: SVGElement, index: number) {
                    this.svgObjects.push(new SVGObject(svgElement, index));
                }, this);
            }
        }
    }
}
