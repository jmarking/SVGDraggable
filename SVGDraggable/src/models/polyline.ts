module SVGDraggable {
    export interface IPolyline {
        removeEvents(): void;
    }
    export class Polyline implements IPolyline {
        svgCanvas: SVGSVGElement;
        g: SVGGElement;
        polyline: SVGPolylineElement | False;
        startNewLine: boolean = true;
        private onClick = (event: MouseEvent) => { this.click(event) };
        private onPointerMove = (event: MouseEvent) => { this.pointerMove(event) };
        private onContextMenu = (event: MouseEvent) => { this.contextMenu(event) };

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }

        public removeEvents(): void {
            this.svgCanvas.removeEventListener('click', this.onClick);
            this.svgCanvas.removeEventListener('contextmenu', this.onContextMenu);
        }
        private loadEvents() {
            this.svgCanvas.addEventListener('click', this.onClick);
            this.svgCanvas.addEventListener('contextmenu', this.onContextMenu);
        }
        private pointerMove(event: MouseEvent) {
        }
        private contextMenu(event: MouseEvent) {
            event.preventDefault();
            this.startNewLine = true;
        }
        private click(event: MouseEvent) {
            if (!this.polyline || this.startNewLine) {
                let svg = this.createSVGElement();
                this.createGElement();
                this.createPolylineElement(event);
                let rect = this.createRectElement(event);

                this.g.appendChild(<SVGPolylineElement>this.polyline);
                this.g.appendChild(rect);
                svg.appendChild(this.g);
                this.svgCanvas.appendChild(svg);
                this.startNewLine = false;
            } else {
                this.addPoint(event);
                this.g.appendChild(this.createRectElement(event));
            }
        }
        private createSVGElement(): SVGSVGElement {
            let svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('draggable', 'true');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('viewBox', `0 0 ${this.svgCanvas.width.baseVal.value} ${this.svgCanvas.height.baseVal.value}`);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            return svg;
        }
        private createPolylineElement(event: MouseEvent): void {
            this.polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            this.polyline.points.appendItem(this.getSVGPoint(event));
            this.polyline.setAttribute('stroke', 'black');
            this.polyline.setAttribute('stroke-width', '4');
            this.polyline.setAttribute('fill', 'white');
            this.polyline.setAttribute('fill-opacity', '0');
        }
        private createGElement(): void {
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        private createRectElement(event: MouseEvent): SVGRectElement {
            let rect: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            let startPoint = this.getSVGPoint(event);
            rect.setAttribute('height', '10');
            rect.setAttribute('width', '10');
            rect.setAttribute('x', `${startPoint.x - 5}`);
            rect.setAttribute('y', `${startPoint.y - 5}`);
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('stroke-width', '3');
            rect.setAttribute('fill', 'white');
            return rect;
        }
        private getSVGPoint(event: MouseEvent): SVGPoint {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }
        private addPoint(event: MouseEvent) {
            (<SVGPolylineElement>this.polyline).points.appendItem(this.getSVGPoint(event));
        }
    }
}
