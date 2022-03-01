import { IController } from "./interfaces/IController";

/** 
 * 世界控制器管理
 */
export class World {

    public controllers: IController[] = [];

    /**
     * 初始化
     */
    public initialize(types: { new(): IController }[]) {

        //创建控制器
        types.forEach(type=>{
            let c = type;
            let controller = new c();
            this.controllers.push(controller)
        })

        //初始化控制器
        this.controllers.forEach(controller=>{
            controller.initialize();
        })
    }

    /**
     * 执行
     */
    public execute(dt: number) {
        this.controllers.forEach(controller=>{
            controller.execute(dt);
        })
    }

    /**
     * 释放
     */
    release() {
        this.controllers.forEach(controller=>{
            controller.release();
        })
        this.controllers = [];
    }
}