import { CoreComponentIds } from "../../logic/components/CoreComponentIds";
import { GamePool } from "../../logic/extensions/GamePool";
import { AddViewSystem } from "../../logic/systems/AddViewSystem";
import { CreateGameBoardCacheSystem } from "../../logic/systems/CreateGameBoardCacheSystem";
import { DestroySystem } from "../../logic/systems/DestroySystem";
import { FallSystem } from "../../logic/systems/FallSystem";
import { FillSystem } from "../../logic/systems/FillSystem";
import { GameBoardSystem } from "../../logic/systems/GameBoardSystem";
import { ProcessInputSystem } from "../../logic/systems/ProcessInputSystem";
import { RemoveViewSystem } from "../../logic/systems/RemoveViewSystem";
import { RenderPositionSystem } from "../../logic/systems/RenderPositionSystem";
import { ScoreSystem } from "../../logic/systems/ScoreSystem";
import { IController } from "./interfaces/IController";
import { Systems } from "./Systems";
import { VisualDebugging } from "./viewer/VisualDebugging";

/** 
 * 世界控制器管理
 */
export class World {

    /** 是否为调试模式 */
    private _isDebug: boolean = false;

    /** 控制器列表 */
    private _controllers: IController[] = [];

    /** 当前Pool */
    private _pool: GamePool = null;

    /** 系统管理器 */
    private _systems: Systems;

    /** 调试视图 */
    private _debugView: VisualDebugging = null;

    /** 获取控制器列表 */
    public get controllers(): IController[] {
        return this._controllers;
    }

    /** 获取当前pool */
    public get pool(): GamePool {
        return this._pool;
    }

    /** 获取系统列表 */
    public get systems(): Systems {
        return this._systems;
    }

    /** 构建世界 */
    constructor(isDebug: boolean) {
        this._isDebug = isDebug;
        this._pool = new GamePool(this, CoreComponentIds, CoreComponentIds.TotalComponents, isDebug);
    }

    /**
     * 初始化
     */
    public initialize(types: { new(): IController }[]) {

        //初始化系统
        this._systems = this.createSystems();
        this._systems.initialize();

        //创建控制器
        types.forEach(type=>{
            let c = type;
            let controller = new c();
            this._controllers.push(controller)
        })

        //初始化控制器
        this._controllers.forEach(controller=>{
            controller.initialize(this);
        })

        //初始化界面
        if (this._isDebug) {
            this._debugView = new VisualDebugging();
            this._debugView.init(this);
        }
    }

    /**
     * 创建系统
     */
    createSystems() {
        let pool = this._pool;
        return new Systems(this)
        //输入系统
        .add(pool.createSystem(ProcessInputSystem))
        //更新系统
        .add(pool.createSystem(CreateGameBoardCacheSystem))
        .add(pool.createSystem(GameBoardSystem))
        .add(pool.createSystem(FallSystem))
        .add(pool.createSystem(FillSystem))
        .add(pool.createSystem(ScoreSystem))
        //渲染系统
        .add(pool.createSystem(RemoveViewSystem))
        .add(pool.createSystem(AddViewSystem))
        .add(pool.createSystem(RenderPositionSystem))
        //销毁系统
        .add(pool.createSystem(DestroySystem));
    }

    /**
     * 执行
     */
    public execute(dt: number) {

        //系统
        this._systems.execute();

        //控制器
        this._controllers.forEach(controller=>{
            controller.execute(dt);
        })

        //调试界面
        if (this._pool._debug) {
            this._debugView.execute(dt);
        }
    }

    /**
     * 释放
     */
    release() {
        this._pool.destroyAllEntities();
        this._systems.clearReactiveSystems()
        this._controllers.forEach(controller=>{
            controller.release();
        })
        this._controllers = [];
        this._pool = null;
    }
}