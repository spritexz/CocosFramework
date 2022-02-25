
import { Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IExecuteSystem } from "../../lib/ecs/interfaces/IExecuteSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

export class SpriteRenderSystem implements IExecuteSystem, ISetPool {

    protected pool: GamePool;
    protected group: Group;

    public execute() {
        var entities = this.group.getEntities();
        for (var i = 0, l = entities.length; i < l; i++) {
            var e = <GameEntity>entities[i];
            var node: Node = <Node>e.sprite.object;
            node.setPosition(e.position.x, e.position.y);
        }
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
        this.group = pool.getGroup(GameMatcher.allOf(GameMatcher.Position, GameMatcher.Sprite));
    }
}