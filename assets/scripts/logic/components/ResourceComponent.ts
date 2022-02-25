import { IComponent } from "../../lib/ecs/interfaces/IComponent";

/** 资源管理组件 */
export class ResourceComponent implements IComponent {
    public name: string;
}