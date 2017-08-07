module SVGDraw {
    export class ToolbarController {
        svgCanvas: SVGSVGElement;
        polyline: IPolyline | False;
        circle: ICircle;
        gauge: IGauge;
        readonly selected: string = 'selected';
        toolbarButtons: Array<HTMLElement>;
        private onClick = (event: MouseEvent) => { this.click(event) };

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            let mocks: { [id: string]: () => any } = {}
            this.toolbarButtons = Array.prototype.slice.call(document.getElementsByClassName('toolbar-btn'));
            this.loadEvents()
        }

        private loadEvents() {
            this.toolbarButtons.forEach(function (button: HTMLElement, index: number) {
                button.addEventListener('click', this.onClick);
            }, this);
        }
        private click(event: MouseEvent) {
            let selectedToolbarButton: HTMLElement = <HTMLElement>event.currentTarget;
            let buttonType = selectedToolbarButton.getAttribute('data-button-type');

            this.toolbarButtons.forEach(function (button, index) {
                if (selectedToolbarButton !== button) {
                    if (button.hasAttribute(this.selected)) {
                        button.removeAttribute(this.selected);
                        this.buttonOff(button.getAttribute('data-button-type'));
                    }
                }
            }, this);

            if (selectedToolbarButton.hasAttribute(this.selected)) {
                selectedToolbarButton.removeAttribute(this.selected);
                this.buttonOff(buttonType);
            } else {
                this.buttonOn(buttonType);
                selectedToolbarButton.setAttribute(this.selected, '');
            }
        }
        private buttonOff(buttonType: string): void {
            switch (buttonType) {
                case 'polyline':
                    (<IPolyline>this.polyline).removeEvents();
                    break;
                case 'pressuregauge':
                    this.gauge.removeEvents();
                    break;
                case 'circle':
                    this.circle.removeEvents();
                    break;
                default:
                    break;
            }
        }
        private buttonOn(buttonType: string): void {
            switch (buttonType) {
                case 'polyline':
                    this.polyline = new Polyline(this.svgCanvas);
                    break;
                case 'pressuregauge':
                    this.gauge = new Gauge(this.svgCanvas);
                    break;
                case 'circle':
                    this.circle = new Circle(this.svgCanvas);
                    break;
                default:
                    break;
            }
        }
    }
}
