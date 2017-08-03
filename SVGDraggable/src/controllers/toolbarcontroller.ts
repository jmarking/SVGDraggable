module SVGDraggable {
    export class ToolbarController {
        svgCanvas: SVGSVGElement;
        polyline: IPolyline | False;
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
            this.toolbarButtons.forEach(function (button, index) {
                if (selectedToolbarButton !== button) {
                    if (button.hasAttribute(this.selected)) {
                        button.removeAttribute(this.selected);
                    }
                }
            }, this);
            if (selectedToolbarButton.hasAttribute(this.selected)) {
                selectedToolbarButton.removeAttribute(this.selected);
                (<IPolyline>this.polyline).removeEvents();
            } else {
                this.polyline = new Polyline(this.svgCanvas);
                selectedToolbarButton.setAttribute(this.selected, '');
            }
        }
    }
}
