import { find, Graphics, Size, Sprite, UITransform, utils, Vec2, Vec3 } from "cc";
import { RenderableComponent } from "../../libs/ECSEngine/ECS/Components/Renderables/RenderableComponent";
import { ComponentTransform } from "../../libs/ECSEngine/ECS/Transform";
import { Vector2 } from "../../libs/ECSEngine/Math/Vector2";
import { Batcher } from "../graphics/Batcher";
import { SceneEmitType, RenderScene } from "../scenes/RenderScene";
import { component_camera } from "./component_camera";

export class SpriteRenderer extends RenderableComponent {
    public getbounds() {
        if (this._areBoundsDirty) {
            if (this._sprite.spriteFrame != null) {
                this._bounds.calculateBounds(this.entity.transform.position, this._localOffset, this._origin,
                    this.entity.transform.scale, this.entity.transform.rotation,
                    this.getwidth(), this.getheight());
            }
            this._areBoundsDirty = false;
        }

        return this._bounds;
    }

    public getwidth() {
        const ui_transform = this._sprite.getComponent(UITransform);
        if (!ui_transform)
            return 0;

        return ui_transform.width;
    }

    public getheight() {
        const ui_transform = this._sprite.getComponent(UITransform);
        if (!ui_transform)
            return 0;

        return ui_transform.height;
    }

    public get origin() {
        return this._origin;
    }
    public set origin(value: Vector2) {
        this.setOrigin(value);
    }
    public setOrigin(origin: Vector2) {
        if (!this._origin.equals(origin)) {
            this._origin = origin;
            this._areBoundsDirty = true;
        }

        return this;
    }

    public get sprite() {
        return this._sprite;
    }
    public set sprite(value: Sprite) {
        this.setSprite(value);
    }

    public get originNormalized() {
        return new Vector2(this._origin.x / this.getwidth() * this.entity.transform.scale.x,
            this._origin.y / this.getheight() * this.entity.transform.scale.y);
    }
    public set originNormalized(value: Vector2) {
        this.setOrigin(new Vector2(value.x * this.getwidth() / this.entity.transform.scale.x,
            value.y * this.getheight() / this.entity.transform.scale.y));

        const ui_transform = this._sprite.getComponent(UITransform);
        if (ui_transform) {
            const originNormalized = new Vec2(value.x, value.y)
            ui_transform.anchorPoint = originNormalized;
        }
    }

    protected _origin: Vector2 = new Vector2();
    protected _sprite!: Sprite;

    constructor(sprite: Sprite) {
        super();
        this.setSprite(sprite);
    }

    onAddedToEntity() {
        super.onAddedToEntity();
        if (!this._sprite.node.parent) {
            find('Canvas')?.addChild(this._sprite.node);
        }
    }

    onRemovedFromEntity() {
        super.onRemovedFromEntity();
        this._sprite.node.removeFromParent();
        this._sprite.node.destroy();
    }

    public setSprite(sprite: Sprite) {
        this._sprite = sprite;
        if (this._sprite != null) {
            const uiTransform = this._sprite.getComponent(UITransform);
            if (uiTransform) {
                const originPoint = uiTransform.anchorPoint;
                if (originPoint) {
                    const scale = this.entity ? this.entity.transform.scale : this._sprite.node.scale;
                    const newOrigin = new Vector2(originPoint.x * this.getwidth() / scale.x,
                        originPoint.y * this.getheight() / scale.y);
                    this._origin = newOrigin;
                }
            }
        }
        return this;
    }

    onEntityTransformChanged(comp: ComponentTransform) {
        if (!this._sprite)
            return;

        switch (comp) {
            case ComponentTransform.position:
                this._sprite.node.setPosition(this.entity.position.x, this.entity.position.y, 0);
                break;
            case ComponentTransform.rotation:
                this._sprite.node.setRotationFromEuler(0, 0, this.entity.rotationDegrees);
                break;
            case ComponentTransform.scale:
                this._sprite.node.setScale(new Vec3(this.entity.scale.x, this.entity.scale.y, 1));
                break;
        }
    }

    public render(batcher: Batcher, camera: component_camera): void {

    }
}