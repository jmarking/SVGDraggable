module SVGDraw {
    export class ToolbarController {
        readonly svgCanvas: SVGSVGElement;
        readonly polyline: IPolyline;
        readonly circle: ICircle;
        readonly selected: string = 'selected';
        readonly toolbarButtons: Array<HTMLElement>;

        private onClick = (event: MouseEvent) => { this.click(event) };

        constructor(svgCanvas: SVGSVGElement) {
            this.svgCanvas = svgCanvas;
            this.polyline = new Polyline(svgCanvas);
            this.circle = new Circle(svgCanvas);
            this.toolbarButtons = Array.prototype.slice.call(document.getElementsByClassName('toolbar-btn'));
            this.loadEvents();
        }

        private loadEvents() {
            this.toolbarButtons.forEach(function (button: HTMLElement, index: number) {
                button.addEventListener('click', this.onClick);
            }, this);
        }
        private click(event: MouseEvent) {
            let selectedToolbarButton: HTMLElement = <HTMLElement>event.currentTarget;
            let buttonType = selectedToolbarButton.getAttribute('data-button-type');

            this.setSelected(selectedToolbarButton);
            this.checkCanvasState(selectedToolbarButton);
        }
        private checkCanvasState(selectedButton: HTMLElement): void {
            let isDraw: boolean = selectedButton.hasAttribute(this.selected) ? true : false;
            this.toolbarButtons.forEach(function (button, index) {
                let buttonType: string = button.getAttribute('data-button-type');
                if (selectedButton !== button) {
                    this.setCanvasState(buttonType, (isDraw ? 'none' : 'edit'));
                }
                else {
                    this.setCanvasState(buttonType, (isDraw ? 'draw' : 'edit'));
                }
            }, this);
        }
        private setCanvasState(buttonType: string, canvasState: CanvasState): void {
            switch (buttonType) {
                case 'polyline':
                    if (this.polyline.getCanvasState() !== canvasState)
                        this.polyline.setCanvasState(canvasState);
                    break;
                case 'pressuregauge':
                    break;
                case 'circle':
                    if (this.circle.getCanvasState() !== canvasState)
                        this.circle.setCanvasState(canvasState);
                    break;
                default:
                    break;
            }
        }
        private setSelected(selectedButton: HTMLElement): void {
            this.toolbarButtons.forEach(function (button, index) {
                if (selectedButton !== button) {
                    if (button.hasAttribute(this.selected)) {
                        button.removeAttribute(this.selected);
                    }
                }
            }, this);

            if (selectedButton.hasAttribute(this.selected)) {
                selectedButton.removeAttribute(this.selected);
            } else {
                selectedButton.setAttribute(this.selected, '');
            }
        }
    }
}
