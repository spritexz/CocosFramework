import { IComponent } from "../../lib/ecs/interfaces/IComponent";

/** 渲染Sprite组件 */
export class SpriteComponent implements IComponent {
    public layer: number;
    public object: Object;
}