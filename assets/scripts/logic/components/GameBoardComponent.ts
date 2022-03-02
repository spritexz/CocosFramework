import { IComponent } from "../../lib/ecs/interfaces/IComponent";

export class GameBoardComponent implements IComponent {
    public columns: number;
    public rows: number;
}