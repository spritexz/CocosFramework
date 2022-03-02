import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 实体销毁系统 */
export class DestroySystem implements IReactiveSystem, ISetPool {
    
    protected pool: GamePool;

    public get trigger(): TriggerOnEvent {
        return GameMatcher.Destroy.onEntityAdded();
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
    }

    /**
     * 添加销毁组件时执行
     */
    public execute(entities: Array<GameEntity>) {
        for (var e of entities) {
            this.pool.destroyEntity(e);
        }
    }
}