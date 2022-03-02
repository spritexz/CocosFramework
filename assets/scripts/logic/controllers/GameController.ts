
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

    /** 系统管理器 */
    private _systems: Systems;

    initialize(world: World) {
        this._world = world;
        this._systems = this.createSystems(world.pool);
        this._systems.initialize();
    }

    execute(dt: number) {
        this._systems.execute();
    }

    release() {
        this._systems.clearReactiveSystems()
    }

    createSystems(pool: GamePool) {
        return new Systems(this._world)
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
}