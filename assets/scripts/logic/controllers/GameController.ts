
import { Pool } from "../../lib/ecs/Pool";
import { Systems } from "../../lib/ecs/Systems";
import { Pools } from "../components/GeneratedComponents";
import { SpriteRenderSystem } from "../systems/SpriteRenderSystem";

/** 游戏控制器 */
export class GameController {

    /** 系统管理器 */
    public systems: Systems;
    
    /** 开始构建 */
    public start() {
        this.systems = this.createSystems(Pools.pool);
        this.systems.initialize();
    }

    /** 创建系统 */
    public createSystems(pool: Pool) {
        return new Systems()
        .add(pool.createSystem(SpriteRenderSystem))
    }

}