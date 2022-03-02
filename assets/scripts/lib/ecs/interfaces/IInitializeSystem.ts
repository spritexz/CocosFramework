import { World } from "../World";
import { ISystem } from "./ISystem";

/**
 * 初始化系统接口
 */
export interface IInitializeSystem extends ISystem {
    /**
     * 初始化
     */
    initialize(world: World);
}