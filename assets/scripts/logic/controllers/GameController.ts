
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

    load(world: World) {
        this._world = world;

        //创建系统
        let pool = this._world.pool;
        this._world.systems
        //输入系统
        .add(pool.createSystem(ProcessInputSystem))
        //更新系统
        .add(pool.createSystem(CreateGameBoardCacheSystem))
        .add(pool.createSystem(GameBoardSystem))
        .add(pool.createSystem(FallSystem))
        .add(pool.createSystem(FillSystem))
        .add(pool.createSystem(ScoreSystem))
        //渲染系统
        .add(pool.createSystem(RemoveViewSystem))
        .add(pool.createSystem(AddViewSystem))
        .add(pool.createSystem(RenderPositionSystem))
        //销毁系统
        .add(pool.createSystem(DestroySystem));
    }

    initialize() {
    }

    execute(dt: number) {
    }

    release() {
    }


}