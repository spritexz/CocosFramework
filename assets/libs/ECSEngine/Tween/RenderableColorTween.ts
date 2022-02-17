///<reference path="./Tweens.ts"/>

import { RenderableComponent } from "../ECS/Components/Renderables/RenderableComponent";
import { Color } from "../Graphics/Batcher/Color";
import { Pool } from "../Utils/Collections/Pool";
import { Lerps } from "./Easing/Lerps";
import { ITweenTarget } from "./Interfaces/ITweenTarget";
import { TweenManager } from "./TweenManager";
import { ColorTween } from "./Tweens";


export class RenderableColorTween extends ColorTween implements ITweenTarget<Color> {
    _renderable: RenderableComponent;

    setTweenedValue(value: Color) {
        this._renderable.color = value;
    }

    getTweenedValue(): Color {
        return this._renderable.color;
    }

    public getTargetObject() {
        return this._renderable;
    }

    public updateValue() {
        this.setTweenedValue(Lerps.ease(this._easeType, this._fromValue, this._toValue, this._elapsedTime, this._duration));
    }

    public setTarget(renderable: RenderableComponent) {
        this._renderable = renderable;
    }

    public recycleSelf() {
        if (this._shouldRecycleTween) {
            this._renderable = null;
            this._target = null;
            this._nextTween = null;
        }

        if (this._shouldRecycleTween && TweenManager.cacheColorTweens) {
            Pool.free(ColorTween, this);
        }
    }
}
