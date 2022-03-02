
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { GameEntity } from "../extensions/GameEntity";

export class GameBoardCacheComponent implements IComponent {
    public grid: Array<Array<GameEntity>>;
}