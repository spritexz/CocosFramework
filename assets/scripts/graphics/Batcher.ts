import { Camera, find, Graphics, Node, Color as ccColor } from "cc";
import { Color } from "../../libs/ECSEngine/Graphics/Batcher/Color";
import { IBatcher } from "../../libs/ECSEngine/Graphics/Batcher/IBatcher";
import { MathHelper } from "../../libs/ECSEngine/Math/MathHelper";
import { Rectangle } from "../../libs/ECSEngine/Math/Rectangle";
import { Vector2 } from "../../libs/ECSEngine/Math/Vector2";
import { RectangleExt } from "../../libs/ECSEngine/Utils/Extensions/RectangleExt";
import { Vector2Ext } from "../../libs/ECSEngine/Utils/Extensions/Vector2Ext";
import { component_camera } from "../components/component_camera";

export class Batcher implements IBatcher {
    public graphics: Graphics;
    public camera: component_camera | null = null;
    public strokeNum: number = 0;

    public readonly MAX_STROKE = 4096;

    constructor() {
        let graphics = find('Canvas/Graphics')?.getComponent(Graphics);
        if (graphics) {
            this.graphics = graphics;
        } else {
            let graphics = new Node('Graphics');
            this.graphics = graphics.addComponent(Graphics);
            find('Canvas')?.addChild(graphics);
        }
    }

    public begin(cam: component_camera) {
        this.graphics.clear();
        this.camera = cam;
        this.strokeNum = 0;
    }

    public end() {
        if (this.strokeNum > 0) {
            this.strokeNum = 0;
            this.graphics.stroke();
        }
    }

    public drawPoints(points: Vector2[], color: Color, thickness: number = 2) {
        if (points.length < 2)
            return;

        for (let i = 1; i < points.length; i++)
            this.drawLine(points[i - 1], points[i], color, thickness);
    }

    public drawPolygon(position: Vector2, points: Vector2[], color: Color,
        closePoly: boolean = true, thickness: number = 1) {
        if (points.length < 2)
            return;

        for (let i = 1; i < points.length; i++)
            this.drawLine(Vector2.add(position, points[i - 1]), Vector2.add(position, points[i]), color, thickness);

        if (closePoly)
            this.drawLine(Vector2.add(position, points[points.length - 1]), Vector2.add(position, points[0]), color, thickness);
    }

    public drawHollowRect(x: number, y: number, width: number, height: number, color: Color, thickness: number = 2) {
        this.graphics.strokeColor = new ccColor(color.r, color.g, color.b);
        this.graphics.lineWidth = thickness;

        const tl = Vector2Ext.round(new Vector2(x, y));
        const tr = Vector2Ext.round(new Vector2(x + width, y));
        const br = Vector2Ext.round(new Vector2(x + width, y + height));
        const bl = Vector2Ext.round(new Vector2(x, y + height));

        this.drawLine(tl, tr, color, thickness);
        this.drawLine(tr, br, color, thickness);
        this.drawLine(br, bl, color, thickness);
        this.drawLine(bl, tl, color, thickness);
    }

    public drawCircle(position: Vector2, radius: number, color: Color, thickness: number = 2) {
        const bounds = new Rectangle(position.x - radius, position.y - radius, radius * 2, radius * 2);
        if (this.camera && !this.camera.bounds.intersects(bounds))
            return;

        this.graphics.strokeColor = new ccColor(color.r, color.g, color.b);
        this.graphics.lineWidth = thickness;
        this.graphics.circle(position.x, position.y, radius);
        this.strokeNum++;
        this.flushBatch();
    }

    public drawCircleLow(position: Vector2, radius: number, color: Color, thickness: number = 2, resolution: number = 12) {
        let last = Vector2.unitX.multiplyScaler(radius);
        let lastP = Vector2Ext.perpendicularFlip(last);

        for (let i = 1; i <= resolution; i++) {
            const at = MathHelper.angleToVector(i * MathHelper.PiOver2 / resolution, radius);
            const atP = Vector2Ext.perpendicularFlip(at);

            this.drawLine(Vector2.add(position, last), Vector2.add(position, at), color, thickness);
            this.drawLine(position.sub(last), position.sub(at), color, thickness);
            this.drawLine(Vector2.add(position, lastP), Vector2.add(position, atP), color, thickness);
            this.drawLine(position.sub(lastP), position.sub(atP), color, thickness);

            last = at;
            lastP = atP;
        }
    }

    public drawRect(x: number, y: number, width: number, height: number, color: Color) {
        const rect = new Rectangle(x, y, width, height);
        if (this.camera && !this.camera.bounds.intersects(rect))
            return;

        this.graphics.strokeColor = new ccColor(color.r, color.g, color.b);
        this.graphics.lineWidth = 1;
        this.graphics.rect(Math.trunc(x), Math.trunc(y), Math.trunc(width), Math.trunc(height));
        this.strokeNum++;
        this.flushBatch();
    }

    public drawLine(start: Vector2, end: Vector2, color: Color, thickness: number = 2) {
        const bounds = RectangleExt.boundsFromPolygonVector([start, end]);
        if (this.camera && !this.camera.bounds.intersects(bounds))
            return;

        this.graphics.lineWidth = thickness;
        this.graphics.strokeColor = new ccColor(color.r, color.g, color.b);
        this.graphics.moveTo(start.x, start.y);
        this.graphics.lineTo(end.x, end.y);
        this.strokeNum++;
        this.flushBatch();
    }

    public drawPixel(position: Vector2, color: Color, size: number = 1) {
        const destRect = new Rectangle(Math.trunc(position.x), Math.trunc(position.y), size, size);
        if (size != 1) {
            destRect.x -= Math.trunc(size * 0.5);
            destRect.y -= Math.trunc(size * 0.5);
        }

        if (this.camera && !this.camera.bounds.intersects(destRect))
            return;

        this.graphics.strokeColor = new ccColor(color.r, color.g, color.b);
        this.graphics.lineWidth = size;
        this.graphics.rect(destRect.x, destRect.y, destRect.width, destRect.height);
        this.strokeNum++;
        this.flushBatch();
    }

    public flushBatch() {
        if (this.strokeNum >= this.MAX_STROKE) {
            this.strokeNum = 0;
            this.graphics.stroke();
        }
    }
}