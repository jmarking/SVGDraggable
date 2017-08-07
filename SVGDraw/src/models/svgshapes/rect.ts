module SVGDraw {
    export interface IRect {
        createRectElement(attributes: RectAttributes): SVGRectElement;
    }
    export class Rect implements IRect {
        public createRectElement(attributes: RectAttributes): SVGRectElement {
            let rect: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('id', attributes.id);
            rect.setAttribute('height', attributes.height);
            rect.setAttribute('width', attributes.width);
            rect.setAttribute('stroke', attributes.stroke);
            rect.setAttribute('stroke-width', attributes.strokeWidth);
            rect.setAttribute('fill', attributes.fill);
            rect.setAttribute('x', `${attributes.x}`);
            rect.setAttribute('y', `${attributes.y}`);
            return rect;
        }
    }
    export class RectAttributes {
        id: string;
        height: string;
        width: string;
        stroke: string;
        strokeWidth: string;
        fill: string;
        x: string;
        y: string;
    }
}
