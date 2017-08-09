/// <reference path="shape.ts" />

module SVGDraw {
    export interface ICircle extends IShape {
        removeEvents(): void;
    }
    export class Circle extends Shape implements ICircle {
        private circle: SVGCircleElement;
        private circles: Array<SVGCircleElement> = new Array();
        private cx: number;
        private cy: number;
        private onPointerDown = (event: MouseEvent) => { this.pointerDown(event) };
        private onPointerUp = (event: MouseEvent) => { this.pointerUp(event) };
        private onPointerMove = (event: MouseEvent) => { this.pointerMove(event) };

        constructor(svgCanvas: SVGSVGElement) {
            super(svgCanvas);
            this.loadEvents();
        }

        public removeEvents(): void {
            this.svgCanvas.removeEventListener('pointerdown', this.onPointerDown);
            this.circles.forEach(function (circle, index) {
                new SVGObject(circle.ownerSVGElement, index);
            });
        }
        private loadEvents(): void {
            //this.svgCanvas.addEventListener('pointerdown', this.onPointerDown);
        }
        private pointerDown(event: MouseEvent): void {
            let svg = this.createSVGElement();
            let g = this.createGElement();
            this.createCircle(event);
            g.appendChild(this.circle);
            svg.appendChild(g);
            this.svgCanvas.appendChild(svg);
            this.svgCanvas.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp);
        }
        private pointerUp(event: MouseEvent): void {
            this.svgCanvas.removeEventListener('pointermove', this.onPointerMove);
            window.removeEventListener('pointerup', this.onPointerUp);
        }
        private pointerMove(event: MouseEvent): void {
            let radius: number = this.calculateRadius(event);
            this.circle.setAttribute('r', radius.toString());
        }
        private calculateRadius(event: MouseEvent): number {
            let mousePoint = this.getSVGPoint(event);
            let xDifferenceSquared = Math.pow(mousePoint.x - this.cx, 2);
            let yDifferenceSquared = Math.pow(mousePoint.y - this.cy, 2);
            let radius = Math.sqrt((xDifferenceSquared + yDifferenceSquared));
            return radius;
        }
        private createCircle(event: MouseEvent): void {
            let point = this.getSVGPoint(event);
            let circle: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', `${point.x}`);
            circle.setAttribute('cy', `${point.y}`);
            circle.setAttribute('r', '0');
            circle.setAttribute('stroke', 'red');
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('fill', 'none');
            this.cx = point.x;
            this.cy = point.y;
            this.circle = circle;
            this.circles.push(circle);
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
        private createGElement(): SVGGElement {
            return document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        private getSVGPoint(event: MouseEvent): SVGPoint {
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
        }

        protected handleStateChange() {
            console.log(`handling state change from circle! State: ${this.canvasState}`);
        }
    }
}
