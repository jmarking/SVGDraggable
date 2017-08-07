module SVGDraw {
    interface IShape {
    }
    export abstract class Shape {
        protected readonly svgCanvas: SVGSVGElement;

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
        }
    }
}
