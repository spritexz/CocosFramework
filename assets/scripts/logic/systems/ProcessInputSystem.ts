import { Exception } from "../../lib/ecs/exceptions/Exception";
import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { GameBoardCacheComponent } from "../components/GameBoardCacheComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 输入系统 */
export class ProcessInputSystem implements IReactiveSystem, ISetPool {
    protected pool: GamePool;

    public get trigger(): TriggerOnEvent {
        return GameMatcher.Input.onEntityAdded();
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
    }

    public execute(entities: GameEntity[]) {
        if (entities.length != 1) {
            throw new Exception("预期只有一个实体, 但是查找到多个: " + entities.length);
        }
        var inputEntity = entities[0];
        var input = inputEntity.input;
        var cache: GameBoardCacheComponent = <GameBoardCacheComponent>(this.pool.gameBoardCache);
        var e = cache.grid[input.x][input.y];
        if (e !== undefined && e.isInteractive) {
            e.isDestroy = true;
        }
        this.pool.destroyEntity(inputEntity);
    }

    release() {
    }
}