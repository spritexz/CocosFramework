
import { RenderableComponent } from "../../Renderables/RenderableComponent";

/** 由于解决碰撞中脚本的循环引用 */
export class CollidersDefine {

    static isRenderableComponent(obj: Object): boolean {
        return obj instanceof RenderableComponent
    }
}