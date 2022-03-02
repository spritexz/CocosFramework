import { Entity } from "./Entity";
import { SingleEntityException } from "./exceptions/SingleEntityException";
import { GroupObserver } from "./GroupObserver";
import { IComponent } from "./interfaces/IComponent";
import { IMatcher } from "./interfaces/IMatcher";
import { GroupEventType } from "./Matcher";
import { ISignal, Signal } from "./utils/Signal";


/** 事件接口: 分组数据发生了变化 */
export interface GroupChanged {(group:Group, entity:Entity, index:number, component:IComponent):void;}
export interface IGroupChanged<T> extends ISignal<T> {
    dispatch(group:Group, entity:Entity, index:number, component:IComponent):void
}

/** 事件接口: 分组数据更新完成 */
export interface GroupUpdated {(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void;}
export interface IGroupUpdated<T> extends ISignal<T> {
    dispatch(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void
}

/**
 * 分组
 */
export class Group {

    /** 订阅实体添加事件 */
    public onEntityAdded: IGroupChanged<GroupChanged> = null

    /** 订阅实体删除事件 */
    public onEntityRemoved: IGroupChanged<GroupChanged> = null

    /** 订阅实体更新事件 */
    public onEntityUpdated: IGroupUpdated<GroupUpdated> = null

    /** 实体列表 */
    private _entities = {}

    /** 匹配器 */
    private _matcher:IMatcher = null

    /** 实体缓冲 */
    public _entitiesCache:Array<Entity> = null

    /** 单一实体缓存 */
    public _singleEntityCache:Entity = null

    /** 字符串缓冲 */
    public _toStringCache:string = ''

    /** 计算这个组中实体的数量 */
    public get count():number {
        return Object.keys(this._entities).length;
    }

    /** 得到这个组的匹配器 */
    public get matcher(): IMatcher {
        return this._matcher;
    }

    /** 构建分组 */
    constructor(matcher:IMatcher) {
        this._entities = {};
        this.onEntityAdded = new Signal<GroupChanged>(this);
        this.onEntityRemoved = new Signal<GroupChanged>(this)
        this.onEntityUpdated = new Signal<GroupUpdated>(this)
        this._matcher = matcher
    }

    /** 
     * 为该组上的事件类型创建一个观察者
     */
    public createObserver(eventType:GroupEventType): GroupObserver {
        if (eventType === undefined) {
            eventType = GroupEventType.OnEntityAdded;
        }
        return new GroupObserver([this], [eventType]);
    }

    /**
     * 处理在不引发事件的情况下从实体中添加和删除组件
     */
    public handleEntitySilently(entity:Entity) {
        if (this._matcher.matches(entity)) {
            this.addEntitySilently(entity);
        } else {
            this.removeEntitySilently(entity);
        }
    }

    /**
     * 处理从实体和事件中添加和删除组件
     */
    public handleEntity(entity: Entity, index: number, component: IComponent) {
        if (this._matcher.matches(entity)) {
            this.addEntity(entity, index, component)
        } else {
            this.removeEntity(entity, index, component)
        }
    }

    /**
     * 更新实体并引发事件
     */
    public updateEntity(entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) {
        if (entity.id in this._entities) {
            const onEntityRemoved: any = this.onEntityRemoved
            if (onEntityRemoved.active) {
                onEntityRemoved.dispatch(this, entity, index, previousComponent)
            }
            const onEntityAdded: any = this.onEntityAdded
            if (onEntityAdded.active) {
                onEntityAdded.dispatch(this, entity, index, newComponent)
            }
            const onEntityUpdated: any = this.onEntityUpdated
            if (onEntityUpdated.active) {
                onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent)
            }
        }
    }
    

    /**
     * 添加实体并引发事件
     */
    public addEntity(entity: Entity, index: number, component: IComponent) {
        if (!(entity.id in this._entities)) {
            this._entities[entity.id] = entity
            this._entitiesCache = null
            this._singleEntityCache = null
            entity.addRef()
            const onEntityAdded: any = this.onEntityAdded
            if (onEntityAdded.active) {
                onEntityAdded.dispatch(this, entity, index, component)
            }
        }
    }

    /**
     * 移除实体并引发事件
     */
    public removeEntity(entity: Entity, index: number, component: IComponent) {
        if (entity.id in this._entities) {
            delete this._entities[entity.id]
            this._entitiesCache = null
            this._singleEntityCache = null
            let onEntityRemoved: any = this.onEntityRemoved
            if (onEntityRemoved.active) {
                onEntityRemoved.dispatch(this, entity, index, component)
            }
            entity.release()
        }
    }

    /**
     * 添加实体而不引发事件
     */
    public addEntitySilently(entity: Entity) {
        if (!(entity.id in this._entities)) {
            this._entities[entity.id] = entity
            this._entitiesCache = null
            this._singleEntityCache = null
            entity.addRef()
        }
    }

    /**
     * 删除实体而不引发事件
     */
    public removeEntitySilently(entity: Entity) {
        if (entity.id in this._entities) {
            delete this._entities[entity.id]
            this._entitiesCache = null
            this._singleEntityCache = null
            entity.release()
        }
    }

    /**
     * 检查分组中是否有此实体
     */
    public containsEntity(entity: Entity): boolean {
        return entity.id in this._entities
    }

    /**
     * 获取分组中的实体列表
     */
    public getEntities(): Entity[] {
        if (this._entitiesCache == null) {
            const entities = this._entities
            const keys = Object.keys(entities)
            const length = keys.length
            const entitiesCache = this._entitiesCache = new Array(length)
            for (let i = 0; i < length; i++) {
                entitiesCache[i] = entities[keys[i]]
            }
        }
        return this._entitiesCache
    }

    /**
     * 获取单个实体, 
     * 如果一个组有一个以上的实体，则会触发异常(SingleEntityException)
     */
    public getSingleEntity(): Entity {
        if (this._singleEntityCache == null) {
            const enumerator = Object.keys(this._entities)
            const c = enumerator.length
            if (c === 1) {
                this._singleEntityCache = this._entities[enumerator[0]]
            } else if (c === 0) {
                return null
            } else {
                throw new SingleEntityException(this._matcher)
            }
        }
        return this._singleEntityCache
    }

     /**
     * 为这个分组创建一个字符串表示: 'Group(Position)'
     */
    public toString(): string {
        if (this._toStringCache == null) {
            this._toStringCache = "Group(" + this._matcher + ")"
        }
        return this._toStringCache
    }
}