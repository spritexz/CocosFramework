import { World } from "../World";

/** 
 * 控制器接口
 */
export interface IController {

    /**
     * 首次加载
     * 
     * 调用顺序: 控制器加载(load) > 系统初始化(systems) > 控制器初始化(initialize)
     */
    load(world:World):any;

    /**
     * 初始化, 在load之后调用
     * 
     * 调用顺序: 控制器加载(load) > 系统初始化(systems) > 控制器初始化(initialize)
     */
    initialize();

    /**
     * 执行
     */
    execute(dt: number);

    /**
     * 释放
     */
    release();
} 