
import { IController } from "../../lib/ecs/interfaces/IController";
import { Systems } from "../../lib/ecs/Systems";
import { World } from "../../lib/ecs/World";
import { GamePool } from "../extensions/GamePool";
import { AddViewSystem } from "../systems/AddViewSystem";
import { CreateGameBoardCacheSystem } from "../systems/CreateGameBoardCacheSystem";
import { DestroySystem } from "../systems/DestroySystem";
import { FallSystem } from "../systems/FallSystem";
import { FillSystem } from "../systems/FillSystem";
import { GameBoardSystem } from "../systems/GameBoardSystem";
import { ProcessInputSystem } from "../systems/ProcessInputSystem";
import { RemoveViewSystem } from "../systems/RemoveViewSystem";
import { RenderPositionSystem } from "../systems/RenderPositionSystem";
import { ScoreSystem } from "../systems/ScoreSystem";

/** 游戏控制器 */
export class GameController implements IController {

    /** 所属世界 */
    private _world: World = null;

    initialize(world: World) {
        this._world = world;
    }

    execute(dt: number) {
    }

    release() {
    }


}