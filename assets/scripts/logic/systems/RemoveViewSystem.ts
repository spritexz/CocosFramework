import { Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { IMatcher } from "../../lib/ecs/interfaces/IMatcher";
import { IReactiveSystem, IEnsureComponents } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { CoreComponentIds } from "../components/CoreComponentIds";
import { ViewComponent } from "../components/ViewComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 从界面上移除实体系统 */
export class RemoveViewSystem implements IReactiveSystem, ISetPool, IEnsureComponents {
    
    protected pool: GamePool;

    private _viewGroup: Group = null;

    public get trigger(): TriggerOnEvent {
        return GameMatcher.Resource.onEntityRemoved();
    }

    public get ensureComponents(): IMatcher {
        return GameMatcher.View;
    }

    public setPool(pool: GamePool) {
        this._viewGroup = pool.getGroup(GameMatcher.View)
        this._viewGroup.onEntityRemoved.add(this.onEntityRemoved, this);
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

    release() {

        //移除事件
        this._viewGroup.onEntityRemoved.remove(this.onEntityRemoved, this);

        //清理界面
        let entitys = this._viewGroup.getEntities()
        entitys.forEach(entity=>{
            let view = <ViewComponent>entity.getComponent(CoreComponentIds.View)
            if (view) {
                (<Node>view.sprite).parent = null
            }
        })
    }
}