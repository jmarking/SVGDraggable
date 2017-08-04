module SVGDraggable {
    export interface IPolyline {
        removeEvents(): void;
    }
    export class Polyline implements IPolyline {
        readonly svgCanvas: SVGSVGElement;
        readonly rect: IRect;
        private g: SVGGElement;
        private polyline: SVGPolylineElement | False;
        private polylines: Array<SVGPolylineElement> = new Array();
        private startNewLine: boolean = true;
        private selectedSVGPoint: SVGPoint;
        private selectedRect: SVGRectElement;
        private onClick = (event: MouseEvent) => { this.click(event) };
        private onPointerMove = (event: MouseEvent) => { this.pointerMove(event) };
        private onContextMenu = (event: MouseEvent) => { this.contextMenu(event) };
        private onPointerDown = (event: MouseEvent) => { this.pointerDown(event) };
        private onPointerUp = (event: MouseEvent) => { this.pointerUp(event) };

        constructor(svgCanvas: SVGSVGElement) {
            this.rect = new Rect();
            this.svgCanvas = svgCanvas;
            this.loadEvents();
        }

        public removeEvents(): void {
            this.svgCanvas.removeEventListener('click', this.onClick);
            this.svgCanvas.removeEventListener('contextmenu', this.onContextMenu);
            //this.polylines.forEach(function (polyline, index) {
            //    new SVGObject(polyline.ownerSVGElement, index);
            //});
        }
        private loadEvents() {
            this.svgCanvas.addEventListener('click', this.onClick);
            this.svgCanvas.addEventListener('contextmenu', this.onContextMenu);
        }
        private pointerMove(event: MouseEvent) {
            let transformValues = this.selectedRect.getCTM();
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            let startPoint = svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
            let newX = startPoint.x - transformValues.e;
            let newY = startPoint.y - transformValues.f;
            this.selectedSVGPoint.x = newX;
            this.selectedSVGPoint.y = newY;
            this.selectedRect.setAttribute('x', (newX - 5).toString());
            this.selectedRect.setAttribute('y', (newY - 5).toString());
        }
        private pointerDown(event: MouseEvent) {
            this.selectedRect = <SVGRectElement>event.currentTarget;
            let parentSVG = this.selectedRect.ownerSVGElement;
            this.polyline = parentSVG.getElementsByTagName('polyline')[0];

            for (var i = 0; i < this.polyline.points.numberOfItems; i++) {
                var point = this.polyline.points.getItem(i);
                if (point.x == (Number(this.selectedRect.getAttribute('x')) + 5) && point.y == (Number(this.selectedRect.getAttribute('y')) + 5)) {
                    this.selectedSVGPoint = point;
                    break;
                };
            };

            window.addEventListener('pointerup', this.onPointerUp);
            this.svgCanvas.addEventListener('pointermove', this.onPointerMove);
        }
        private pointerUp(event: MouseEvent) {
            this.svgCanvas.removeEventListener('pointermove', this.onPointerMove);
        }
        private contextMenu(event: MouseEvent) {
            event.preventDefault();
            this.startNewLine = true;
        }
        private click(event: MouseEvent) {
            let svgPoint = this.getSVGPoint(event);
            //let rect = this.rect.createRectElement(svgPoint.x, svgPoint.y);
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
                this.polylines.push(<SVGPolylineElement>this.polyline);
            } else {
                this.addPoint(event);
                this.g.appendChild(this.createRectElement(event));
            }
        }
        private createSVGElement(): SVGSVGElement {
            let svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('draggable', 'false');
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
        private createDefsElement(): SVGDefsElement {
            return document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        }
        private createUseElement(event: MouseEvent): SVGUseElement {
            let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            let svgPoint = this.getSVGPoint(event);
            use.setAttribute('x', `${svgPoint.x - 5}`);
            use.setAttribute('y', `${svgPoint.y - 5}`);
            return use;
        }
        private createRectElement(event: MouseEvent): SVGRectElement {
            let rect: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            let svgPoint = this.getSVGPoint(event);
            rect.classList.add('rectNode');
            rect.setAttribute('height', '10');
            rect.setAttribute('width', '10');
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('stroke-width', '3');
            rect.setAttribute('fill', 'white');
            rect.setAttribute('x', `${svgPoint.x - 5}`);
            rect.setAttribute('y', `${svgPoint.y - 5}`);
            rect.addEventListener('pointerdown', this.onPointerDown);
            return rect;
        }
        private getRectAttributes(x: string, y: string): RectAttributes {
            let rectAttributes = new RectAttributes();
            rectAttributes.id = 'rectNode';
            rectAttributes.height = '10';
            rectAttributes.width = '10';
            rectAttributes.stroke = 'black';
            rectAttributes.strokeWidth = '3';
            rectAttributes.fill = 'white';
            rectAttributes.x = x;
            rectAttributes.y = y;
            return rectAttributes;
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
