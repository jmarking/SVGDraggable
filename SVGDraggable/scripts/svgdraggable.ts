module SVGDraggable {
    export class Drag {
        selectedPolyline: HTMLElement;

        constructor() {
            this.registerEvents();
        }

        private registerEvents() {
            document.addEventListener('mousemove', (event) => { this.mousemoveHandle(event) });
            document.addEventListener('click', (event) => { this.documentClickHandle(event) });

            let polylines: Array<HTMLElement> = Array.prototype.slice.call(document.getElementsByTagName('polyline'));
            polylines.forEach(function (polyline, index) {
                polyline.addEventListener('click', (event) => { this.clickHandle(event); });
            }, this);
        }
        private mousemoveHandle(event: MouseEvent): any {
            let xMouse = document.getElementById('xmouse');
            let yMouse = document.getElementById('ymouse');

            xMouse.innerHTML = event.clientX.toString();
            yMouse.innerHTML = event.clientY.toString();
        }
        private clickHandle(event: MouseEvent): any {
            this.selectedPolyline = (<HTMLElement>event.currentTarget);
            let objectId = this.selectedPolyline.parentNode.attributes['id'].value;
            (<HTMLElement>document.querySelector(`[href="#${objectId}"][class="selected"`)).style.display = 'block';
        }
        private documentClickHandle(event: MouseEvent): any {
            let selectObject = (<HTMLElement>event.currentTarget);
            if (this.selectedPolyline !== selectObject) {
                let selectedIndicatorsShowing = <HTMLElement>document.querySelector('[display="block"][class="selected"]');
            }
        }
    }
}