import { Entity } from "./Entity";
import { GroupObserverException } from "./exceptions/GroupObserverException";
import { Group, GroupChanged } from "./Group";
import { IComponent } from "./interfaces/IComponent";
import { GroupEventType } from "./Matcher";

/**
 * 分组观察器
 */
export class GroupObserver {

    /** 被观察到的实体列表 */
    private _collectedEntities = {}

    /** 分组列表 */
    protected _groups: Array<Group> = null

    /** 分组事件类型列表 */
    protected _eventTypes: Array<GroupEventType> = null

    /** 添加实体缓冲事件 */
    protected _addEntityCache: GroupChanged = null

    /** 
     * 获取被观察到的实体列表
     */
    public get collectedEntities() {
        return this._collectedEntities;
    }

    /** 
     * 构建观察分组观察器
     */
    constructor(groups: Array<Group>, eventTypes: GroupEventType[]) {
        this._groups = groups;
        this._eventTypes = eventTypes;
        if (groups.length !== eventTypes.length) {
            let str = "分组(" + groups.length + ")和事件列表(" + eventTypes.length + ")的数量不匹配";
            throw new GroupObserverException(str)
        }
        this._collectedEntities = {};
        this._addEntityCache = this.addEntity;
        this.activate()
    }

    
    /**
     * 激活事件
     */
    activate() {
        for (let i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
            const group: Group = this._groups[i]
            const eventType: GroupEventType = this._eventTypes[i]
            if (eventType === GroupEventType.OnEntityAdded) {
                group.onEntityAdded.remove(this._addEntityCache, this)
                group.onEntityAdded.add(this._addEntityCache, this)
            } else if (eventType === GroupEventType.OnEntityRemoved) {
                group.onEntityRemoved.remove(this._addEntityCache, this)
                group.onEntityRemoved.add(this._addEntityCache, this)
            } else if (eventType === GroupEventType.OnEntityAddedOrRemoved) {
                group.onEntityAdded.remove(this._addEntityCache, this)
                group.onEntityAdded.add(this._addEntityCache, this)
                group.onEntityRemoved.remove(this._addEntityCache, this)
                group.onEntityRemoved.add(this._addEntityCache, this)
            } else {
                throw `Invalid eventType [${typeof eventType}:${eventType}] in GroupObserver::activate`
            }
        }
    }

    /**
     * 关闭事件
     */
    deactivate() {
        for (let i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
            const group: Group = this._groups[i]
            group.onEntityAdded.remove(this._addEntityCache, this)
            group.onEntityRemoved.remove(this._addEntityCache, this)
            this.clearCollectedEntities()
        }
    }

    /**
     * 清除实体列表
     */
    clearCollectedEntities() {
        for (let e in this._collectedEntities) {
            this._collectedEntities[e].release()
        }
        this._collectedEntities = {}
    }
      
    /**
     * 向该观察者添加一个实体
     */
    addEntity = (group: Group, entity: Entity, index: number, component: IComponent) => {
        if (!(entity.id in this._collectedEntities)) {
            this._collectedEntities[entity.id] = entity
            entity.addRef()
        }
    }
}