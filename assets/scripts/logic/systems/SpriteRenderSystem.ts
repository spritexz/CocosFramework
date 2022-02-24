import { Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IExecuteSystem } from "../../lib/ecs/interfaces/IExecuteSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { Matcher } from "../../lib/ecs/Matcher";
import { Pool } from "../../lib/ecs/Pool";

export class SpriteRenderSystem implements IExecuteSystem, ISetPool {

    /** Pool */
    protected pool: Pool;

    /** 分组 */
    protected group: Group;

    /** 执行更新 */
    public execute() {
        var entitas = this.group.getEntities();
        for (let i = 0, l = entitas.length; i < l; i++) {
            let e = entitas[i];
            let node: Node = <Node>e.sprite.object;
            node.setPosition(e.position.x, e.position.y)
        }
    }

    /** 设置Pool */
    public setPool(pool: Pool) {
        this.pool = pool;
        this.group = pool.getGroup(Matcher.allOf(Matcher.Position,  Matcher.Sprite))
    }
}