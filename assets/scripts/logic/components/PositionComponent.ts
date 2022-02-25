import { IComponent } from "../../lib/ecs/interfaces/IComponent";

/** 坐标组件 */
export class PositionComponent implements IComponent {
    public x: number;
    public y: number;
}