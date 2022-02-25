import { director, instantiate, Prefab, resources, Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";


export class AddViewSystem implements ISetPool {
    protected pool: GamePool;
    protected group: Group;

    /**
     * 监听添加的资源
     */
    public setPool(pool: GamePool) {
        this.pool = pool;
        pool.getGroup(GameMatcher.Resource).onEntityAdded.add(this.onEntityAdded);
    }

    /**
     * 加载和配置这个资源组件的精灵  
     */
    protected onEntityAdded = (group: Group, e: GameEntity, index: number, component: IComponent) => {
        /** 这里可以从配置文件中读取相应的文件路径 */
        let prefab = resources.get(e.resource.name) as Prefab;
        let sprite = instantiate(prefab)
        let position = e.position;
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        sprite.position.set(position.x, position.y);
        sprite.parent = canvas.getChildByName("Sprite")
        e.addSprite(1, sprite);
    };
}