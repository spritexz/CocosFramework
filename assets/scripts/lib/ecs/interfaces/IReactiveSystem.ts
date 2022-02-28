import { Entity } from "../Entity";
import { TriggerOnEvent } from "../TriggerOnEvent";
import { IMatcher } from "./IMatcher";
import { ISystem } from "./ISystem";

/** 反馈执行系统接口 */
export interface IReactiveExecuteSystem extends ISystem {
    /** 
     * 执行实体操作
     */
    execute(entities: Array<Entity>)
}

/** 多反馈系统接口 */
export interface IMultiReactiveSystem extends IReactiveExecuteSystem {
    /** 
     * 触发事件的目标列表
     */
    triggers: Array<TriggerOnEvent>
}

/** 单反馈系统接口 */
export interface IReactiveSystem extends IReactiveExecuteSystem {
    /** 
     * 触发事件的目标
     */
    trigger: TriggerOnEvent
}

/** 组件担保接口 */
export interface IEnsureComponents {
    /**
     * 被担保组件匹配器
     */
    ensureComponents: IMatcher
}

/** 组件执行接口 */
export interface IExcludeComponents {
    /**
     * 被执行组件匹配器
     */
    excludeComponents: IMatcher
}

/** 反馈清理接口 */
export interface IClearReactiveSystem {
    /**
     * 是否执行清理完成
     */
    clearAfterExecute: boolean
}