module SVGDraw {
    export interface IPolyline extends IShape {
    }
    export class Polyline extends Shape implements IPolyline {
        readonly containerDiv: HTMLElement;
        private svg: SVGSVGElement;
        private g: SVGGElement;
        private polyline: SVGPolylineElement;
        private polylineSelection: SVGPolylineElement;
        private polylines: Array<SVGPolylineElement> = new Array();
        private startNewLine: boolean = true;
        private selectedSVGPoints: Array<SVGPoint> = new Array();
        private selectedRect: SVGRectElement;
        private onClick = (event: MouseEvent) => { this.click(event) };
        private onPointerMove = (event: MouseEvent) => { this.pointerMove(event) };
        private onContextMenu = (event: MouseEvent) => { this.contextMenu(event) };
        private onPointerDown = (event: MouseEvent) => { this.pointerDown(event) };
        private onPointerUp = (event: MouseEvent) => { this.pointerUp(event) };
        private onKeydown = (event: KeyboardEvent) => { this.deletePolyline(event) };
        private onWindowClick = (event: MouseEvent) => { this.windowClick(event) };

        constructor(svgCanvas: SVGSVGElement) {
            super(svgCanvas);
            window.addEventListener('click', this.onWindowClick);
        }

        private pointerMove(event: MouseEvent) {
            let transformValues = this.selectedRect.getCTM();
            let svgPoint = this.svgCanvas.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            let startPoint = svgPoint.matrixTransform(this.svgCanvas.getScreenCTM().inverse());
            let newX = startPoint.x - transformValues.e;
            let newY = startPoint.y - transformValues.f;
            for (let i = 0; i < this.selectedSVGPoints.length; i++) {
                let point = this.selectedSVGPoints[i];
                point.x = newX;
                point.y = newY;
            }
            this.selectedRect.setAttribute('x', (newX - 5).toString());
            this.selectedRect.setAttribute('y', (newY - 5).toString());
        }
        private pointerDown(event: MouseEvent) {
            this.selectedRect = <SVGRectElement>event.currentTarget;
            let parentSVG = this.selectedRect.ownerSVGElement;
            let polylines = parentSVG.getElementsByTagName('polyline');

            for (var i = 0; i < polylines[0].points.numberOfItems; i++) {
                var point = polylines[0].points.getItem(i);
                if (point.x == (Number(this.selectedRect.getAttribute('x')) + 5) && point.y == (Number(this.selectedRect.getAttribute('y')) + 5)) {
                    this.selectedSVGPoints.push(point);
                    this.selectedSVGPoints.push(polylines[1].points.getItem(i));
                    break;
                };
            };

            window.addEventListener('pointerup', this.onPointerUp);
            this.svgCanvas.addEventListener('pointermove', this.onPointerMove);
        }
        private pointerUp(event: MouseEvent) {
            this.selectedSVGPoints = new Array();
            this.svgCanvas.removeEventListener('pointermove', this.onPointerMove);
        }
        private resizePolyline(event: MouseEvent) {
        }
        private deletePolyline(event: KeyboardEvent) {
            let blah = this;
            let selectedSVG = <SVGSVGElement>document.querySelector('svg[selected]');
            let keyId = event.keyCode;
            if (keyId === 46 && selectedSVG) selectedSVG.remove();
        }
        private windowClick(event: MouseEvent) {
            let svg = this.svgCanvas.querySelector('svg[selected]');
            if (svg && !svg.contains(<Node>event.target)) {
                this.removeOtherSelected();
            }
        }
        private polylineSelect(event: MouseEvent) {
            // hook events that can happen once selected.
            // show selection graphic.
            this.polyline = <SVGPolylineElement>event.currentTarget;
            this.svg = this.polyline.ownerSVGElement;

            if (!this.svg.hasAttribute('selected')) {
                this.removeOtherSelected();
                this.svg.setAttribute('selected', '');
                this.polylineSelection = <SVGPolylineElement>this.svg.querySelector('polyline.polyline-selection');
                this.polylineSelection.setAttribute('stroke-opacity', '1');
                //this.containerDiv.addEventListener('keydown', this.onKeydown);
                document.addEventListener('keydown', this.onKeydown);
            }
        }
        private removeOtherSelected() {
            let selected = this.svgCanvas.querySelector('svg[selected]');
            if (selected) {
                selected.removeAttribute('selected');
                this.polylineSelection = <SVGPolylineElement>selected.querySelector('polyline.polyline-selection');
                this.polylineSelection.setAttribute('stroke-opacity', '0');
            }
        }
        private contextMenu(event: MouseEvent) {
            event.preventDefault();
            this.startNewLine = true;
        }
        private click(event: MouseEvent) {
            let svgPoint = this.getSVGPoint(event);
            if (!this.polyline || this.startNewLine) {
                let svg = this.createSVGElement();
                this.createGElement();
                this.createPolylineElement(event);
                let polylineSelection: SVGPolylineElement = this.createPolylineElementSelected(event);
                let rect = this.createRectElement(event);

                this.g.appendChild(polylineSelection);
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
            svg.classList.add('draw-state');
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
            this.polyline.setAttribute('stroke', 'red');
            this.polyline.setAttribute('stroke-width', '6');
            this.polyline.setAttribute('fill', 'white');
            this.polyline.setAttribute('fill-opacity', '0');
        }
        private createPolylineElementSelected(event: MouseEvent): SVGPolylineElement {
            let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline.points.appendItem(this.getSVGPoint(event));
            polyline.classList.add('polyline-selection');
            polyline.setAttribute('stroke', '#ACACAC');
            polyline.setAttribute('stroke-dasharray', '15');
            polyline.setAttribute('stroke-opacity', '0');
            polyline.setAttribute('stroke-width', '12');
            polyline.setAttribute('fill', 'white');
            polyline.setAttribute('fill-opacity', '0');
            return polyline;
        }
        private createGElement(): void {
            this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        //private createDefsElement(): SVGDefsElement {
        //    return document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        //}
        //private createUseElement(event: MouseEvent): SVGUseElement {
        //    let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        //    let svgPoint = this.getSVGPoint(event);
        //    use.setAttribute('x', `${svgPoint.x - 5}`);
        //    use.setAttribute('y', `${svgPoint.y - 5}`);
        //    return use;
        //}
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
            let svg: SVGSVGElement = (<SVGPolylineElement>this.polyline).ownerSVGElement;
            let polylineSelection: Element = svg.querySelector('polyline.polyline-selection');
            let svgPoint = this.getSVGPoint(event);
            (<SVGPolylineElement>this.polyline).points.appendItem(svgPoint);
            (<SVGPolylineElement>polylineSelection).points.appendItem(svgPoint);
        }
        private selectedContextMenu(event: MouseEvent) {
            let svgContainer = document.getElementById('svgcanvas');
            let div = document.createElement('div');
            let ul = document.createElement('ul');
            let li = document.createElement('li');
            li.innerHTML = 'Properties';
            ul.appendChild(li);
            div.appendChild(ul);
            div.setAttribute('position', 'absolute');
            div.setAttribute('top', event.clientX.toString());
            div.setAttribute('left', event.clientY.toString());
            svgContainer.appendChild(div);
        }

        protected handleStateChange() {
            switch (this.canvasState) {
                case 'draw':
                    this.handleDrawStateEvents();
                    break;
                case 'edit':
                    this.handleEditStateEvents();
                    break;
                case 'none':
                    break;
                default:
                    break;
            }
        }
        private handleDrawStateEvents() {
            let polylines: Array<SVGPolylineElement> = Array.prototype.slice.call(this.svgCanvas.getElementsByTagName('polyline'));
            polylines.forEach(function (polyline, index) {
                let svg = polyline.ownerSVGElement;
                svg.classList.add('draw-state');
                svg.classList.remove('edit-state');
                polyline.removeEventListener('click', this.onClick);
            }, this);

            this.polyline = null;
            this.onClick = (event: MouseEvent) => { this.click(event) };
            this.svgCanvas.addEventListener('click', this.onClick);
            this.svgCanvas.addEventListener('contextmenu', this.onContextMenu);
        }
        private handleEditStateEvents() {
            this.svgCanvas.removeEventListener('click', this.onClick);
            this.svgCanvas.removeEventListener('contextmenu', this.onContextMenu);

            this.onClick = (event: MouseEvent) => { this.polylineSelect(event) };
            //this.onContextMenu = (event: MouseEvent) => { this.selectedContextMenu(event) };
            let polylines: Array<SVGPolylineElement> = Array.prototype.slice.call(this.svgCanvas.getElementsByTagName('polyline'));
            polylines.forEach(function (polyline, index) {
                let svg = polyline.ownerSVGElement;
                svg.classList.remove('draw-state');
                svg.classList.add('edit-state');
                polyline.addEventListener('click', this.onClick);
                //document.addEventListener('contextmenu', this.onContextMenu);
            }, this);
        }
    }
}
