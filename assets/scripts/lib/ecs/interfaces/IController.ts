import { World } from "../World";

/** 
 * 控制器接口
 */
export interface IController {

    /**
     * 初始化
     */
    initialize(world: World);

    /**
     * 执行
     */
    execute(dt: number);

    /**
     * 释放
     */
    release();
} 