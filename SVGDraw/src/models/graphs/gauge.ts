module SVGDraw {
    export interface IGauge {
        removeEvents(): void;
    }
    export class Gauge {
        svgCanvas: SVGSVGElement;
        private onPointerDown = (event: MouseEvent) => { this.pointerDown(event) };

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }

        public removeEvents(): void {
            this.svgCanvas.removeEventListener('pointerdown', this.onPointerDown);
        }

        private loadEvents(): void {
            this.svgCanvas.addEventListener('pointerdown', this.onPointerDown);
        }
        private pointerDown(event: MouseEvent): void {
            this.getSvgAsync(event);
        }
        async getSvgAsync(event: MouseEvent) {
            let response = await fetch('http://localhost:6929/images/pressuregauge.svg');
            let text = await response.text();
            let doc = new DOMParser().parseFromString(text, 'image/svg+xml');
            let svg = doc.getElementsByTagName('svg');
            let svgPoint = this.getSVGPoint(event);
            let svgXSize = svg[0].viewBox.baseVal.width;
            let svgYSize = svg[0].viewBox.baseVal.height;
            svg[0].setAttribute('viewBox', `0 0 ${this.svgCanvas.clientWidth} ${this.svgCanvas.clientHeight}`);
            svg[0].setAttribute('preserveAspectRatio', 'xMinYMin meet');
            let g = svg[0].getElementsByTagName('g')[0];
            g.setAttribute('transform', `translate(${svgPoint.x - (svgXSize / 2)},${svgPoint.y - (svgYSize / 2)})`);
            this.svgCanvas.appendChild(doc.childNodes[0]);
        }
        private getSVGPoint(event: MouseEvent): SVGPoint {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }
    }
}
