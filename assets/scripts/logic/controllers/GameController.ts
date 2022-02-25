
import { Systems } from "../../lib/ecs/Systems";
import { GamePool } from "../extensions/GamePool";
import { Pools } from "../extensions/Pools";
import { AddViewSystem } from "../systems/AddViewSystem";
import { SpriteRenderSystem } from "../systems/SpriteRenderSystem";

/** 游戏控制器 */
export class GameController {

    /** 系统管理器 */
    public systems: Systems;
    
    /** 开始构建 */
    public start() {
        this.systems = this.createSystems(Pools.pool);
        this.systems.initialize();

        //创建一个玩家
        Pools.pool.createPlayer();
    }

    /** 创建系统 */
    public createSystems(pool: GamePool) {
        return new Systems()
        .add(pool.createSystem(SpriteRenderSystem))
        .add(pool.createSystem(AddViewSystem))
    }

    /** 更新系统 */
    public update(delta: number) {
        this.systems.execute();
    }
}