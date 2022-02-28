import { IComponent } from "../../lib/ecs/interfaces/IComponent";

export class InputComponent implements IComponent {
    public x: number;
    public y: number;
}