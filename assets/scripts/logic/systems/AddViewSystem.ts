
import { director, instantiate, Prefab, resources, Node, UITransform } from "cc";
import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { Pools } from "../extensions/Pools";

/** 添加实体到界面系统 */
export class AddViewSystem implements IReactiveSystem {

    public get trigger(): TriggerOnEvent {
        return GameMatcher.Resource.onEntityAdded();
    }

    public execute(entities: Array<GameEntity>) {
        for (var i = 0, l = entities.length; i < l; i++) {
            var e = entities[i];

            //添加到界面
            let prefab = resources.get(e.resource.name) as Prefab;
            let node = instantiate(prefab)
            let canvas = director.getScene().getChildByName('Canvas') as any as Node
            node.parent = canvas.getChildByName("Sprite")
            e.addView(node);

            //设置坐标
            if (e.hasPosition) {
                let ui = node.getComponent(UITransform)
                let pos = e.position;
                let w = ui.width;
                let gameBoard = Pools.pool.gameBoard;
                let x = w + pos.x * w - gameBoard.rows * w / 2;
                let y = w + pos.y * w - gameBoard.columns * w / 2 + w;
                node.position.set(x, y);
            }
        }
    }
}