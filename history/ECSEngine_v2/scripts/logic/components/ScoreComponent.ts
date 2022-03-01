import { IComponent } from "../../lib/ecs/interfaces/IComponent";

export class ScoreComponent implements IComponent {
    public value: number;
}