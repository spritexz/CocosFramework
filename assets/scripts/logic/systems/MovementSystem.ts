import { Group } from "../../lib/ecs/Group";
import { IExecuteSystem } from "../../lib/ecs/interfaces/IExecuteSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { Matcher } from "../../lib/ecs/Matcher";
import { Pool } from "../../lib/ecs/Pool";

/** 移动系统 */
export class MovementSystem implements IExecuteSystem, ISetPool {

    protected pool: Pool;
    protected group: Group;

    public execute() {
        var entities = this.group.getEntities();
        for (var i = 0, l = entities.length; i < l; i++) {
            var e = entities[i];
            var delta = bosco.delta;
            e.position.x += (e.velocity.x * delta);
            e.position.y -= (e.velocity.y * delta);
        }
    }

    public setPool(pool: Pool) {
        this.pool = pool;
        this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Velocity));
    }
}