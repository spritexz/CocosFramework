import { Entity } from "../Entity";
import { TriggerOnEvent } from "../TriggerOnEvent";
import { IMatcher } from "./IMatcher";
import { ISystem } from "./ISystem";

/** 反馈执行系统接口 */
export interface IReactiveExecuteSystem extends ISystem {
    execute(entities: Array<Entity>)
}

/** 多反馈系统接口 */
export interface IMultiReactiveSystem extends IReactiveExecuteSystem {
    triggers: Array<TriggerOnEvent>
}

/** 单反馈系统接口 */
export interface IReactiveSystem extends IReactiveExecuteSystem {
    trigger: TriggerOnEvent
}

/** 组件担保接口 */
export interface IEnsureComponents {
    ensureComponents: IMatcher
}

/** 组件执行接口 */
export interface IExcludeComponents {
    excludeComponents: IMatcher
}

/** 反馈清理接口 */
export interface IClearReactiveSystem {
    clearAfterExecute: boolean
}