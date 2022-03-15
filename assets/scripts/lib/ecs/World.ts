
import { IController } from "./interfaces/IController";
import { Pool } from "./Pool";
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
    private _pool: Pool = null;

    /** 系统管理器 */
    private _systems: Systems = null;

    /** 调试视图 */
    private _debugView: VisualDebugging = null;

    /** 获取控制器列表 */
    public get controllers(): IController[] {
        return this._controllers;
    }

    /** 获取当前pool */
    public get pool(): Pool {
        return this._pool;
    }

    /** 获取系统列表 */
    public get systems(): Systems {
        return this._systems;
    }

    /** 
     * 加载
     * @param isDebug 是否为调试模式
     * @param allocSize 需要申请内存的实体数量
     */
    public load<T extends Pool>(poolType:{ new(...args: any):T }, 
        components: {}, totalComponents: number, 
        isDebug: boolean = false, allocSize: number = 200) 
    {
        let cPool = poolType;
        this._pool = new cPool(this, allocSize, components, totalComponents, isDebug);
        this._isDebug = isDebug;
    }

    /**
     * 初始化
     */
    public initialize(types: { new(): IController }[]) {
        if (this._pool == null) {
            console.error("请调用load()后再进行初始化操作!!!");
            return
        }

        //初始化系统
        this._systems = new Systems(this);

        //创建控制器
        types.forEach(type=>{
            let c = type;
            let controller = new c();
            controller.load(this)
            this._controllers.push(controller)
        })

        //初始化系统
        this._systems.initialize();

        //初始化控制器
        this._controllers.forEach(controller=>{
            controller.initialize();
        })

        //初始化界面
        if (this._isDebug) {
            this._debugView = new VisualDebugging();
            this._debugView.init(this);
        }
    }

    /**
     * 执行
     */
    public execute(dt: number) {

        //系统
        this._systems?.execute();

        //控制器
        this._controllers?.forEach(controller=>{
            controller?.execute(dt);
        })

        //调试界面
        if (this._isDebug) {
            this._debugView?.execute(dt);
        }
    }

    /**
     * 释放
     */
    release() {

        //依次清理掉 系统 > 实体池 > 控制器 中的数据
        this._systems.release()
        this._pool.destroyAllEntities();
        this._controllers.forEach(controller=>{
            controller.release();
        })

        //移除调试界面
        if (this._isDebug) {
            this._debugView?.release();
        }

        //重置数据
        this._systems = null;
        this._pool = null;
        this._controllers = [];
        this._debugView = null;
    }
}