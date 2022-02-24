
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { Pool } from "../../lib/ecs/Pool";

/** 组件缓冲池 */
export class Pools {

    /** 当前Pool */
    static _pool: Pool;

    /** Pool列表 */
    static _allPools: Array<Pool>;

    /** 获取当前Pool */
    static get pool(): Pool {
        if (Pools._pool == null) {
            Pools._pool = new Pool(CoreComponentIds, CoreComponentIds.TotalComponents, false);
            //entitas.viewer.VisualDebugging.init(Pools._pool);
        }
        return Pools._pool;
    }

    /** 获取Pool列表 */
    static get allPools(): Array<Pool> {
        if (Pools._allPools == null) {
            Pools._allPools = [Pools.pool];
        }
        return Pools._allPools;
    }
}

/** 核心组件ID */
export enum CoreComponentIds {
    /** 总组件 */
    TotalComponents,
    /** 玩家 */
    Player,
    /** 坐标 */
    Position,
    /** 速度 */
    Velocity,
    /** 渲染Sprite */
    Sprite,
}

/** 玩家组件 */
export class PlayerComponent implements IComponent {
}

/** 坐标组件 */
export class PositionComponent implements IComponent {
    public x: number;
    public y: number;
}

/** 速度组件 */
export class VelocityComponent implements IComponent {
    public x: number;
    public y: number;
}


/** 渲染Sprite组件 */
export class SpriteComponent implements IComponent {
    public layer: number;
    public object: Object;
}