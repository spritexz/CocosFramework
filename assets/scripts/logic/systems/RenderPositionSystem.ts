import { Node, UITransform, tween, Vec3 } from "cc";
import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 渲染位置系统 */
export class RenderPositionSystem implements IReactiveSystem, ISetPool {
    
    public pool: GamePool = null;

    public get trigger(): TriggerOnEvent {
        return (<GameMatcher>GameMatcher.allOf(GameMatcher.View, GameMatcher.Position)).onEntityAdded();
    }

    setPool(pool: GamePool) {
        this.pool = pool;
    }

    public execute(entities: GameEntity[]) {
        var gameBoard = this.pool.gameBoard;
        for (let e of entities) {
            let pos = e.position;
            let node: Node = e.view.sprite;
            let ui = node.getComponent(UITransform)
            let w = ui.width;
            let x = w + pos.x * w - gameBoard.rows * w / 2;
            let y = w + pos.y * w - gameBoard.columns * w / 2;
            tween(node).to(0.3, { position: new Vec3(x, y) }).start();
        }
    }
}