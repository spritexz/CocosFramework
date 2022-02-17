import { MathHelper } from "../Math/MathHelper";
import { Matrix2D } from "../Math/Matrix2D";
import { Vector2 } from "../Math/Vector2";
import { Vector2Ext } from "../Utils/Extensions/Vector2Ext";
import { Entity } from "./Entity";


export enum ComponentTransform {
    position,
    scale,
    rotation,
}

export enum DirtyType {
    clean = 0,
    positionDirty = 1,
    scaleDirty = 2,
    rotationDirty = 4,
}

export class Transform {
    /** 与此转换关联的实体 */
    public readonly entity: Entity;
    public hierarchyDirty: DirtyType;
    public _localDirty: boolean;
    public _localPositionDirty: boolean;
    public _localScaleDirty: boolean;
    public _localRotationDirty: boolean;
    public _positionDirty: boolean;
    public _worldToLocalDirty: boolean;
    public _worldInverseDirty: boolean;
    /**
     * 值会根据位置、旋转和比例自动重新计算
     */
    public _localTransform: Matrix2D = Matrix2D.identity;
    /**
     * 值将自动从本地和父矩阵重新计算。
     */
    public _worldTransform = Matrix2D.identity;
    public _rotationMatrix: Matrix2D = Matrix2D.identity;
    public _translationMatrix: Matrix2D = Matrix2D.identity;
    public _scaleMatrix: Matrix2D = Matrix2D.identity;
    public _children: Transform[] = [];

    constructor(entity: Entity) {
        this.entity = entity;
        this.scale = this._localScale = Vector2.one;
    }

    /**
     * 这个转换的所有子元素
     */
    public get childCount() {
        return this._children.length;
    }

    /**
     * 变换在世界空间的旋转度
     */
    public get rotationDegrees(): number {
        return MathHelper.toDegrees(this._rotation);
    }

    /**
     * 变换在世界空间的旋转度
     * @param value
     */
    public set rotationDegrees(value: number) {
        this.setRotation(MathHelper.toRadians(value));
    }

    /**
     * 旋转相对于父变换旋转的角度
     */
    public get localRotationDegrees(): number {
        return MathHelper.toDegrees(this._localRotation);
    }

    /**
     * 旋转相对于父变换旋转的角度
     * @param value
     */
    public set localRotationDegrees(value: number) {
        this.localRotation = MathHelper.toRadians(value);
    }

    public get localToWorldTransform(): Matrix2D {
        this.updateTransform();
        return this._worldTransform;
    }

    public _parent: Transform;

    /**
     * 获取此转换的父转换
     */
    public get parent() {
        return this._parent;
    }

    /**
     * 设置此转换的父转换
     * @param value
     */
    public set parent(value: Transform) {
        this.setParent(value);
    }

    public _worldToLocalTransform = Matrix2D.identity;

    public get worldToLocalTransform(): Matrix2D {
        if (this._worldToLocalDirty) {
            if (this.parent == null) {
                this._worldToLocalTransform = Matrix2D.identity;
            } else {
                this.parent.updateTransform();
                this._worldToLocalTransform = Matrix2D.invert(this.parent._worldTransform);
            }

            this._worldToLocalDirty = false;
        }

        return this._worldToLocalTransform;
    }

    public _worldInverseTransform = Matrix2D.identity;

    public get worldInverseTransform(): Matrix2D {
        this.updateTransform();
        if (this._worldInverseDirty) {
            this._worldInverseTransform = Matrix2D.invert(this._worldTransform);
            this._worldInverseDirty = false;
        }

        return this._worldInverseTransform;
    }

    public _position: Vector2 = Vector2.zero;

    /**
     * 变换在世界空间中的位置
     */
    public get position(): Vector2 {
        this.updateTransform();
        if (this._positionDirty) {
            if (this.parent == null) {
                this._position = this._localPosition;
            } else {
                this.parent.updateTransform();
                Vector2Ext.transformR(this._localPosition, this.parent._worldTransform, this._position);
            }

            this._positionDirty = false;
        }

        return this._position;
    }

    /**
     * 变换在世界空间中的位置
     * @param value
     */
    public set position(value: Vector2) {
        this.setPosition(value.x, value.y);
    }

    public _scale: Vector2 = Vector2.one;

    /**
     * 变换在世界空间的缩放
     */
    public get scale(): Vector2 {
        this.updateTransform();
        return this._scale;
    }

    /**
     * 变换在世界空间的缩放
     * @param value
     */
    public set scale(value: Vector2) {
        this.setScale(value);
    }

    public _rotation: number = 0;

    /**
     * 在世界空间中以弧度旋转的变换
     */
    public get rotation(): number {
        this.updateTransform();
        return this._rotation;
    }

    /**
     * 变换在世界空间的旋转度
     * @param value
     */
    public set rotation(value: number) {
        this.setRotation(value);
    }

    public _localPosition: Vector2 = Vector2.zero;

    /**
     * 转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
     */
    public get localPosition(): Vector2 {
        this.updateTransform();
        return this._localPosition;
    }

    /**
     * 转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
     * @param value
     */
    public set localPosition(value: Vector2) {
        this.setLocalPosition(value);
    }

    public _localScale: Vector2 = Vector2.one;

    /**
     * 转换相对于父元素的比例。如果转换没有父元素，则与transform.scale相同
     */
    public get localScale(): Vector2 {
        this.updateTransform();
        return this._localScale;
    }

    /**
     * 转换相对于父元素的比例。如果转换没有父元素，则与transform.scale相同
     * @param value
     */
    public set localScale(value: Vector2) {
        this.setLocalScale(value);
    }

    public _localRotation: number = 0;

    /**
     * 相对于父变换的旋转，变换的旋转。如果转换没有父元素，则与transform.rotation相同
     */
    public get localRotation(): number {
        this.updateTransform();
        return this._localRotation;
    }

    /**
     * 相对于父变换的旋转，变换的旋转。如果转换没有父元素，则与transform.rotation相同
     * @param value
     */
    public set localRotation(value: number) {
        this.setLocalRotation(value);
    }

    /**
     * 返回在索引处的转换子元素
     * @param index
     */
    public getChild(index: number): Transform {
        return this._children[index];
    }

    /**
     * 设置此转换的父转换
     * @param parent
     */
    public setParent(parent: Transform): Transform {
        if (this._parent == parent)
            return this;

        if (this._parent != null) {
            const index = this._parent._children.findIndex(t => t == this);
            if (index != -1)
                this._parent._children.splice(index, 1);
        }

        if (parent != null) {
            parent._children.push(this);
        }

        this._parent = parent;
        this.setDirty(DirtyType.positionDirty);

        return this;
    }

    /**
     * 设置转换在世界空间中的位置
     * @param x
     * @param y
     */
    public setPosition(x: number, y: number): Transform {
        let position = new Vector2(x, y);
        if (position.equals(this._position))
            return this;

        this._position = position;
        if (this.parent != null) {
            this.localPosition = Vector2.transform(this._position, this.worldToLocalTransform);
        } else {
            this.localPosition = position;
        }
        this._positionDirty = false;

        return this;
    }

    /**
     * 设置转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
     * @param localPosition
     */
    public setLocalPosition(localPosition: Vector2): Transform {
        if (localPosition.equals(this._localPosition))
            return this;

        this._localPosition = localPosition;
        this._localDirty = this._positionDirty = this._localPositionDirty = this._localRotationDirty = this._localScaleDirty = true;
        this.setDirty(DirtyType.positionDirty);

        return this;
    }


    /**
     * 设置变换在世界空间的旋转度
     * @param radians
     */
    public setRotation(radians: number): Transform {
        this._rotation = radians;
        if (this.parent != null) {
            this.localRotation = this.parent.rotation + radians;
        } else {
            this.localRotation = radians;
        }

        return this;
    }

    /**
     * 设置变换在世界空间的旋转度
     * @param degrees
     */
    public setRotationDegrees(degrees: number): Transform {
        return this.setRotation(MathHelper.toRadians(degrees));
    }

    /**
     * 旋转精灵的顶部，使其朝向位置
     * @param pos
     */
    public lookAt(pos: Vector2) {
        const sign = this.position.x > pos.x ? -1 : 1;
        const vectorToAlignTo = this.position.sub(pos).normalize();
        this.rotation = sign * Math.acos(vectorToAlignTo.dot(Vector2.unitY));
    }

    /**
     * 相对于父变换的旋转设置变换的旋转。如果转换没有父元素，则与transform.rotation相同
     * @param radians
     */
    public setLocalRotation(radians: number) {
        this._localRotation = radians;
        this._localDirty = this._positionDirty = this._localPositionDirty = this._localRotationDirty = this._localScaleDirty = true;
        this.setDirty(DirtyType.rotationDirty);

        return this;
    }

    /**
     * 相对于父变换的旋转设置变换的旋转。如果转换没有父元素，则与transform.rotation相同
     * @param degrees
     */
    public setLocalRotationDegrees(degrees: number): Transform {
        return this.setLocalRotation(MathHelper.toRadians(degrees));
    }

    /**
     * 设置变换在世界空间中的缩放
     * @param scale
     */
    public setScale(scale: Vector2): Transform {
        this._scale = scale;
        if (this.parent != null) {
            this.localScale = Vector2.divide(scale, this.parent._scale);
        } else {
            this.localScale = scale;
        }
        return this;
    }

    /**
     * 设置转换相对于父对象的比例。如果转换没有父元素，则与transform.scale相同
     * @param scale
     */
    public setLocalScale(scale: Vector2): Transform {
        this._localScale = scale;
        this._localDirty = this._positionDirty = this._localScaleDirty = true;
        this.setDirty(DirtyType.scaleDirty);

        return this;
    }

    /**
     * 对精灵坐标进行四舍五入
     */
    public roundPosition() {
        this.position = Vector2Ext.round(this._position);
    }

    public updateTransform() {
        if (this.hierarchyDirty != DirtyType.clean) {
            if (this.parent != null)
                this.parent.updateTransform();

            if (this._localDirty) {
                if (this._localPositionDirty) {
                    Matrix2D.createTranslation(this._localPosition.x, this._localPosition.y, this._translationMatrix);
                    this._localPositionDirty = false;
                }

                if (this._localRotationDirty) {
                    Matrix2D.createRotation(this._localRotation, this._rotationMatrix);
                    this._localRotationDirty = false;
                }

                if (this._localScaleDirty) {
                    Matrix2D.createScale(this._localScale.x, this._localScale.y, this._scaleMatrix);
                    this._localScaleDirty = false;
                }

                Matrix2D.multiply(this._scaleMatrix, this._rotationMatrix, this._localTransform);
                Matrix2D.multiply(this._localTransform, this._translationMatrix, this._localTransform);

                if (this.parent == null) {
                    this._worldTransform = this._localTransform;
                    this._rotation = this._localRotation;
                    this._scale = this._localScale;
                    this._worldInverseDirty = true;
                }

                this._localDirty = false;
            }

            if (this.parent != null) {
                Matrix2D.multiply(this._localTransform, this.parent._worldTransform, this._worldTransform);
                this._rotation = this._localRotation + this.parent._rotation;
                this._scale = this.parent._scale.multiply(this._localScale);;
                this._worldInverseDirty = true;
            }

            this._worldToLocalDirty = true;
            this._positionDirty = true;
            this.hierarchyDirty = DirtyType.clean;
        }
    }

    public setDirty(dirtyFlagType: DirtyType) {
        if ((this.hierarchyDirty & dirtyFlagType) == 0) {
            this.hierarchyDirty |= dirtyFlagType;

            switch (dirtyFlagType) {
                case DirtyType.positionDirty:
                    this.entity.onTransformChanged(ComponentTransform.position);
                    break;
                case DirtyType.rotationDirty:
                    this.entity.onTransformChanged(ComponentTransform.rotation);
                    break;
                case DirtyType.scaleDirty:
                    this.entity.onTransformChanged(ComponentTransform.scale);
                    break;
            }

            // 告诉子项发生了变换
            for (let i = 0; i < this._children.length; i++)
                this._children[i].setDirty(dirtyFlagType);
        }
    }

    /**
     * 从另一个transform属性进行拷贝
     * @param transform
     */
    public copyFrom(transform: Transform) {
        this._position = transform.position.clone();
        this._localPosition = transform._localPosition.clone();
        this._rotation = transform._rotation;
        this._localRotation = transform._localRotation;
        this._scale = transform._scale;
        this._localScale = transform._localScale;

        this.setDirty(DirtyType.positionDirty);
        this.setDirty(DirtyType.rotationDirty);
        this.setDirty(DirtyType.scaleDirty);
    }

    public toString(): string {
        return `[Transform: parent: ${this.parent}, position: ${this.position}, rotation: ${this.rotation},
                scale: ${this.scale}, localPosition: ${this._localPosition}, localRotation: ${this._localRotation},
                localScale: ${this._localScale}]`;
    }
}
