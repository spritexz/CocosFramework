import { Entity } from "./Entity";
import { GroupObserver } from "./GroupObserver";
import { IExecuteSystem } from "./interfaces/IExecuteSystem";
import { IMatcher } from "./interfaces/IMatcher";
import { IMultiReactiveSystem, IReactiveExecuteSystem, IReactiveSystem } from "./interfaces/IReactiveSystem";
import { Pool } from "./Pool";
import { TriggerOnEvent } from "./TriggerOnEvent";
import { World } from "./World";

/** 检查对象中是否包含字段 */
function as(object, method:string) {
    return method in object ? object : null
}

/**
 * 反馈系统
 */
export class ReactiveSystem implements IExecuteSystem {

    /** 所属世界 */
    protected _world: World = null;

    /** 子系统 */
    private _subsystem: IReactiveExecuteSystem;

    /** 观察者 */
    public _observer:GroupObserver;
    
    /** <?> */
    public _ensureComponents:IMatcher;
    
    /** <?> */
    public _excludeComponents:IMatcher;

    /** <?> */
    public _clearAfterExecute:boolean;
    
    /** <?> */
    public _buffer:Array<Entity>;
        
    /** 获取子系统 */
    public get subsystem(): IReactiveExecuteSystem {
        return this._subsystem;
    }

    /** 构建系统 */
    constructor(pool: Pool, subSystem: IReactiveSystem | IMultiReactiveSystem) {

        let triggers: Array<TriggerOnEvent> = null
        if ('triggers' in subSystem) {
            triggers = subSystem['triggers'];
        } else {
            triggers = [subSystem['trigger']];

        }
        this._subsystem = subSystem

        const ensureComponents = as(subSystem, 'ensureComponents')
        if (ensureComponents != null) {
            this._ensureComponents = ensureComponents.ensureComponents
        }
        const excludeComponents = as(subSystem, 'excludeComponents')
        if (excludeComponents != null) {
            this._excludeComponents = excludeComponents.excludeComponents
        }

        this._clearAfterExecute = as(subSystem, 'clearAfterExecute') != null

        const triggersLength = triggers.length
        const groups = new Array(triggersLength)
        const eventTypes = new Array(triggersLength)
        for (let i = 0; i < triggersLength; i++) {
            const trigger = triggers[i]
            groups[i] = pool.getGroup(trigger.trigger)
            eventTypes[i] = trigger.eventType
        }
        this._observer = new GroupObserver(groups, eventTypes)
        this._buffer = []
    }

    initialize(world: World) {
        this._world = world;
    }

    /** 激活系统 */
    public activate() {
        this._observer.activate()
    }

    /** 关闭系统 */
    public deactivate() {
        this._observer.deactivate()
    }

    /** 清理系统 */
    public clear() {
        this._observer.clearCollectedEntities()
    }

    /** 执行系统 */
    public execute() {
        const collectedEntities = this._observer.collectedEntities
        const ensureComponents = this._ensureComponents
        const excludeComponents = this._excludeComponents
        const buffer = this._buffer
        let j = buffer.length
        if (Object.keys(collectedEntities).length != 0) {
            if (ensureComponents) {
                if (excludeComponents) {
                    for (let k in collectedEntities) {
                        const e = collectedEntities[k]
                        if (ensureComponents.matches(e) && !excludeComponents.matches(e)) {
                            buffer[j++] = e.addRef()
                        }
                    }
                } else {
                    for (let k in collectedEntities) {
                        const e = collectedEntities[k]
                        if (ensureComponents.matches(e)) {
                            buffer[j++] = e.addRef()
                        }
                    }
                }
            } else if (excludeComponents) {
                for (let k in collectedEntities) {
                    const e = collectedEntities[k]
                    if (!excludeComponents.matches(e)) {
                        buffer[j++] = e.addRef()
                    }
                }
            } else {
                for (let k in collectedEntities) {
                    const e = collectedEntities[k]
                    buffer[j++] = e.addRef()
                }
            }

            this._observer.clearCollectedEntities()
            if (buffer.length != 0) {
                this._subsystem.execute(buffer)
                for (let i = 0, bufferCount = buffer.length; i < bufferCount; i++) {
                    buffer[i].release()
                }
                buffer.length = 0
                if (this._clearAfterExecute) {
                    this._observer.clearCollectedEntities()
                }
            }
        }
    }

    /** 释放 */
    release() {
        this._subsystem.release()
        this._subsystem = null
    }
}