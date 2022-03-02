import { Pool } from "../Pool";

/**
 * 系统接口
 */
export interface ISystem {
}

/**
 * 设置Pool接口
 */
export interface ISetPool {
    /**
     * 设置Pool
     */
    setPool(pool: Pool): any;
}