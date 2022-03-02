import { CoreComponentIds } from "../../logic/components/CoreComponentIds";
import { GamePool } from "../../logic/extensions/GamePool";
import { IController } from "./interfaces/IController";

/** 
 * 世界控制器管理
 */
export class World {

    /** 控制器列表 */
    private _controllers: IController[] = [];

    /** 当前Pool */
    private _pool: GamePool = null;

    /** 获取控制器列表 */
    public get controllers(): IController[] {
        return this._controllers;
    }

    /** 获取当前pool */
    public get pool(): GamePool {
        return this._pool;
    }

    /** 构建世界 */
    constructor() {
        this._pool = new GamePool(this, CoreComponentIds, CoreComponentIds.TotalComponents, false);
    }

    /**
     * 初始化
     */
    public initialize(types: { new(): IController }[]) {

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
    }

    /**
     * 执行
     */
    public execute(dt: number) {
        this._controllers.forEach(controller=>{
            controller.execute(dt);
        })
    }

    /**
     * 释放
     */
    release() {
        this._pool.destroyAllEntities();
        this._controllers.forEach(controller=>{
            controller.release();
        })
        this._controllers = [];
        this._pool = null;
    }
}