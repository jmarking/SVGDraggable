module SVGDraw {
    export interface IShape {
        setCanvasState<K extends CanvasState>(canvasState: K): void;
        getCanvasState(): CanvasState;
    }
    export abstract class Shape implements IShape {
        protected readonly svgCanvas: SVGSVGElement;
        protected canvasState: CanvasState;

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            this.canvasState = 'none';
        }

        public setCanvasState<K extends CanvasState>(canvasState: K): void {
            this.canvasState = canvasState;
            this.handleStateChange();
        }
        public getCanvasState(): CanvasState {
            return this.canvasState;
        }

        protected abstract handleStateChange();
    }
}
