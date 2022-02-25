import { IComponent } from "../../lib/ecs/interfaces/IComponent";

/** 速度组件 */
export class VelocityComponent implements IComponent {
    public x: number;
    public y: number;
}