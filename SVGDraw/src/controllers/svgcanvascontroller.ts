module SVGDraw {
    export class SVGCanvasController {
        svgObjects: Array<SVGObject>;
        svgCanvas: SVGSVGElement;
        private shape: IPolyline | ICircle;
        private blah: any;

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            this.loadSvgObjects();
        }

        public test<T extends typeof Circle | typeof Polyline | typeof Rect>(blah: T) {
            this.blah = blah;
            this.createSVGShape(this.blah);
            //console.log(this.createSVGShape(this.shape));
        }
        public createSVGShape<T extends IPolyline | ICircle>(shape: new (svgCanvas: SVGSVGElement) => T): void {
            this.shape = new shape(this.svgCanvas);
            console.log(this.shape);
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
