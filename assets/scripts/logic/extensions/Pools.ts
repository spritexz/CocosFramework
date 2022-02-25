
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { GamePool } from "./GamePool";
import { CoreComponentIds } from "../components/CoreComponentIds";

/** 组件缓冲池 */
export class Pools {

    /** 当前Pool */
    static _pool: GamePool;

    /** Pool列表 */
    static _allPools: Array<GamePool>;

    /** 获取当前Pool */
    static get pool(): GamePool {
        if (Pools._pool == null) {
            Pools._pool = new GamePool(CoreComponentIds, CoreComponentIds.TotalComponents, false);

            //初始化调试界面
            //entitas.viewer.VisualDebugging.init(Pools._pool);
        }
        return Pools._pool;
    }

    /** 获取Pool列表 */
    static get allPools(): Array<GamePool> {
        if (Pools._allPools == null) {
            Pools._allPools = [Pools.pool];
        }
        return Pools._allPools;
    }
}