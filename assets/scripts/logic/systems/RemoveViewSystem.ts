import { Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { IMatcher } from "../../lib/ecs/interfaces/IMatcher";
import { IReactiveSystem, IEnsureComponents } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { ViewComponent } from "../components/ViewComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 从界面上移除实体系统 */
export class RemoveViewSystem implements IReactiveSystem, ISetPool, IEnsureComponents {
    
    protected pool: GamePool;

    public get trigger(): TriggerOnEvent {
        return GameMatcher.Resource.onEntityRemoved();
    }

    public get ensureComponents(): IMatcher {
        return GameMatcher.View;
    }

    public setPool(pool: GamePool) {
        pool.getGroup(GameMatcher.View).onEntityRemoved.add(this.onEntityRemoved);
    }

    public execute(entities: Array<GameEntity>) {
        for (var e of entities) {
            e.removeView();
        }
    }

    protected onEntityRemoved(group: Group, entity: GameEntity, index: number, component: IComponent) {
        let node = <Node>(<ViewComponent>component).sprite
        node.parent = null;
    }
}