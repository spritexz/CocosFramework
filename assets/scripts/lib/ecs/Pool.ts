
import { ComponentReplaced, Entity, EntityChanged, EntityReleased } from "./Entity";
import { EntityIsNotDestroyedException } from "./exceptions/EntityIsNotDestroyedException";
import { PoolDoesNotContainEntityException } from "./exceptions/PoolDoesNotContainEntityException";
import { Group } from "./Group";
import { IComponent } from "./interfaces/IComponent";
import { IMatcher } from "./interfaces/IMatcher";
import { ISystem } from "./interfaces/ISystem";
import { ReactiveSystem } from "./ReactiveSystem";
import { Bag } from "./utils/Bag";
import { ISignal, Signal } from "./utils/Signal";
import { UUID } from "./utils/UUID";
import { World } from "./World";

/** 事件接口: Pool数据发生了变化 */
export interface PoolChanged { (pool: Pool, entity: Entity): void; }
export interface IPoolChanged<T> extends ISignal<T> {
    dispatch(pool: Pool, entity: Entity): void
}

/** 事件接口: 组合数据发生了变化 */
export interface PoolGroupChanged { (pool: Pool, group: Group): void; }
export interface IPoolGroupChanged<T> extends ISignal<T> {
    dispatch(pool: Pool, group: Group): void
}

/** 检查对象中是否包含字段 */
function as(obj: any, method1: string): any {
    return method1 in obj ? obj : null
}

/** 
 * 实体和组件的缓存池, 
 * 游戏世界
 */
export class Pool {

    /** 有效组件类型的枚举 */
    public static componentsEnum: Object = null;

    /** 总得组件数量 */
    public static totalComponents: number = 0;

    /** 所属世界 */
    private _world: World = null;

    /** 是否为调试模式 */
    public _debug: boolean = false;

    /** 用于调试的实体名称 */
    public name: string = '';

    /** 实体索引计数 */
    public entityIndex: number = 0;

    /** 组件列表内存池 */
    public componentAlloc: Array<Array<IComponent>> = null;

    /** 组件列表内存池大小 */
    public componentAllocSize: number = 0;

    /** 实体列表 */
    public _entities = {};

    /** 分组列表 */
    public _groups = {};

    /** 分组列表索引 */
    public _groupsForIndex: Bag<Bag<Group>> = null;

    /** 等待回收的实体列表 */
    public _reusableEntities: Bag<Entity> = new Bag<Entity>();

    /** 还有引用的实体列表 */
    public _retainedEntities = {};

    /** 组件枚举 */
    public _componentsEnum: Object = null;

    /** 池中组件的总数 */
    public _totalComponents: number = 0;

    /** 创建时的索引 */
    public _creationIndex: number = 0;

    /** 实体缓冲列表 */
    public _entitiesCache: Array<Entity> = null;

    /** 缓存更新分组时添加或删除组件事件 */
    public _cachedUpdateGroupsComponentAddedOrRemoved: EntityChanged;

    /** 缓存更新分组组件替换事件 */
    public _cachedUpdateGroupsComponentReplaced: ComponentReplaced;

    /** 缓存实体释放事件 */
    public _cachedOnEntityReleased: EntityReleased;

    /** 订阅实体创建事件 */
    public onEntityCreated: IPoolChanged<PoolChanged> = null;

    /** 订阅实体将被销毁事件 */
    public onEntityWillBeDestroyed: IPoolChanged<PoolChanged> = null;

    /** 订阅实体销毁事件 */
    public onEntityDestroyed: IPoolChanged<PoolChanged> = null;

    /** 订阅分组创建事件 */
    public onGroupCreated: IPoolGroupChanged<PoolGroupChanged> = null;

    /** 获取池中组件的总数 */
    public get totalComponents(): number {
        return this._totalComponents;
    }

    /** 获取有效实体数量 */
    public get count(): number {
        return Object.keys(this._entities).length;
    }

    /** 获取分组数量 */
    public get groupCount(): number {
        return Object.keys(this._groups).length;
    }

    /** 获取等待回收的实体数 */
    public get reusableEntitiesCount(): number {
        return this._reusableEntities.size();
    }

    /** 获取仍然有引用的实体数 */
    public get retainedEntitiesCount(): number {
        return Object.keys(this._retainedEntities).length;
    }

    /**
     * 系统中有setPool方法时, 调用该方法进行通知
     */
    public static setPool(system: ISystem, pool: Pool) {
        const poolSystem = as(system, 'setPool')
        if (poolSystem != null) {
            poolSystem.setPool(pool)
        }
    }

    /** 构建Pool */
    constructor(world: World, componentAllocSize: number, components: {}, totalComponents: number, debug: boolean = false, startCreationIndex: number = 0) {
        this._world = world;

        //绑定事件
        this.onGroupCreated = new Signal<PoolGroupChanged>(this)
        this.onEntityCreated = new Signal<PoolChanged>(this)
        this.onEntityDestroyed = new Signal<PoolChanged>(this)
        this.onEntityWillBeDestroyed = new Signal<PoolChanged>(this)
        this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved
        this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced
        this._cachedOnEntityReleased = this.onEntityReleased

        //初始化数据
        this._debug = debug
        this._componentsEnum = components
        this._totalComponents = totalComponents
        this._creationIndex = startCreationIndex
        this._groupsForIndex = new Bag<Bag<Group>>()
        Pool.componentsEnum = components
        Pool.totalComponents = totalComponents

        //需要申请的组件池内存大小
        this.componentAllocSize = componentAllocSize;
    }

    /**
     * 分配实体池
     * @param count 组件数量
     * @param size 最大实体数
     */
    public allocMemory(count: number, size: number): void {
        this.componentAlloc = new Array(size)
        for (let e = 0; e < size; e++) {
            this.componentAlloc[e] = new Array(count)
            for (let k = 0; k < count; k++) {
                this.componentAlloc[e][k] = null
            }
        }
    }

    /** 
     * 扩展实体池
     * @param count 组件数量
     * @param size 最大实体数
     */
    public extendMemory(count: number, size: number): void {
        console.log(`${this.entityIndex}的内存分配不足, 扩展分配${size}个实体.`)
        for (let i = this.entityIndex, l = i + size; i < l; i++) {
            this.componentAlloc[i] = new Array(count)
            for (let k = 0; k < count; k++) {
                this.componentAlloc[i][k] = null;
            }
        }
    }

    /**
     * 创建一个新实体
     */
    public createEntity<T extends Entity>(type: { new(t: Array<IComponent>): T }, name: string): T {

        //初始化实体池
        const size = this.componentAllocSize;
        if (this.componentAlloc == null) {
            this.allocMemory(this._totalComponents, size);
        }
        
        //创建实体
        let entity: T = null;
        if (this._reusableEntities.size() > 0) {
            entity = <T>this._reusableEntities.removeLast();
        } else {
            
            //分配一个组件池给实体, 每个实体在创建时分配一次
            const alloc = this.componentAlloc;
            let instanceIndex = this.entityIndex++;
            let componentMem: Array<IComponent> = alloc[instanceIndex];
            if (componentMem == null) {
                this.extendMemory(this._totalComponents, size)
                componentMem = alloc[instanceIndex];
            }

            //构建实体
            let entityType = type;
            entity = new entityType(componentMem);
        }
        entity.name = name
        entity.id = UUID.randomUUID()
        entity._isEnabled = true
        entity._creationIndex = this._creationIndex++
        entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved, this)
        entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved, this)
        entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced, this)
        entity.onEntityReleased.add(this._cachedOnEntityReleased, this)
        entity.addRef()

        //保存实体
        this._entities[entity.id] = entity
        this._entitiesCache = null

        //派发实体创建事件
        const onEntityCreated: any = this.onEntityCreated
        if (onEntityCreated.active) {
            onEntityCreated.dispatch(this, entity)
        }
        return entity
    }

    /**
     * 摧毁一个实体
     */
    public destroyEntity(entity: Entity) {
        if (!(entity.id in this._entities)) {
            throw new PoolDoesNotContainEntityException(entity, "无法摧毁实体!")
        }
        delete this._entities[entity.id]
        this._entitiesCache = null

        const onEntityWillBeDestroyed: any = this.onEntityWillBeDestroyed
        if (onEntityWillBeDestroyed.active) {
            onEntityWillBeDestroyed.dispatch(this, entity)
        }

        entity.destroy()

        const onEntityDestroyed: any = this.onEntityDestroyed
        if (onEntityDestroyed.active) {
            onEntityDestroyed.dispatch(this, entity)
        }

        if (entity._refCount === 1) {
            entity.onEntityReleased.remove(this._cachedOnEntityReleased, this)
            this._reusableEntities.add(entity)
        } else {
            this._retainedEntities[entity.id] = entity
        }
        entity.release()
    }

    /**
     * 摧毁所有实体
     */
    public destroyAllEntities() {
        const entities = this.getEntities()
        for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
            this.destroyEntity(entities[i])
        }
    }

    /**
     * 检查池是否有此实体
     */
    public hasEntity(entity: Entity): boolean {
        return entity.id in this._entities
    }

    /**
     * 获取所有实体
     */
    public getEntities(matcher?: IMatcher): Entity[] {
        if (matcher) {
            /** PoolExtension::getEntities */
            return this.getGroup(matcher).getEntities()
        } else {
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
    }

    /**
     * 遍历所有实体
     */
    public foreachEntities(call: (key: string, entitie: Entity) => void) {
        for (const key in this._entities) {
            call(key, this._entities[key])
        }
    }

    /** 遍历所有组合 */
    public foreachGroups(call: (key: string, group: Group) => void) {
        for (const key in this._groups) {
            call(key, this._groups[key])
        }
    }

    /** 遍历所有等待回收的实体 */
    public foreachReusableEntities(call: (index: number, entitie: Entity) => void) {
        for (let i = 0; i < this._reusableEntities.size(); i++) {
            const element = this._reusableEntities.get(i);
            call(i, element);
        }
    }

    /** 遍历仍然有引用的实体数 */
    public foreachRetainedEntities(call: (key: string, entitie: Entity) => void) {
        for (const key in this._retainedEntities) {
            call(key, this._retainedEntities[key])
        }
    }

    /**
     * 获取匹配的所有实体
     */
    public getGroup(matcher: IMatcher): Group {
        let group: Group

        if (matcher.id in this._groups) {
            group = this._groups[matcher.id]
        } else {
            group = new Group(matcher)

            const entities = this.getEntities()
            for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                group.handleEntitySilently(entities[i])
            }
            this._groups[matcher.id] = group

            for (let i = 0, indicesLength = matcher.indices.length; i < indicesLength; i++) {
                const index = matcher.indices[i]
                if (this._groupsForIndex[index] == null) {
                    this._groupsForIndex[index] = new Bag()
                }
                this._groupsForIndex[index].add(group)
            }
            const onGroupCreated: any = this.onGroupCreated
            if (onGroupCreated.active) {
                onGroupCreated.dispatch(this, group)
            }
        }
        return group
    }

    /**
     * 创建系统
     */
    public createSystem<T extends ISystem>(systemType: { new(): T }) {

        //创建系统并初始化
        let c = systemType;
        let system = new c();

        //通知创建完成
        Pool.setPool(system, this)

        //<?>
        const reactiveSystem = as(system, 'trigger')
        if (reactiveSystem != null) {
            return new ReactiveSystem(this, reactiveSystem)
        }
        const multiReactiveSystem = as(system, 'triggers')
        if (multiReactiveSystem != null) {
            return new ReactiveSystem(this, multiReactiveSystem)
        }
        return system
    }


    /** 
     * 缓存更新分组时添加或删除组件事件
     */
    protected updateGroupsComponentAddedOrRemoved = (entity: Entity, index: number, component: IComponent) => {
        const groups = this._groupsForIndex[index]
        if (groups != null) {
            for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                groups[i].handleEntity(entity, index, component)
            }
        }
    }


    /**
     * 缓存更新分组组件替换事件
     */
    protected updateGroupsComponentReplaced = (entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) => {
        const groups = this._groupsForIndex[index]
        if (groups != null) {
            for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                groups[i].updateEntity(entity, index, previousComponent, newComponent)
            }
        }
    }

    /**
     * 缓存实体释放事件
     */
    protected onEntityReleased = (entity: Entity) => {
        if (entity._isEnabled) {
            throw new EntityIsNotDestroyedException("不能释放实体.")
        }
        entity.onEntityReleased.remove(this._cachedOnEntityReleased, this)
        delete this._retainedEntities[entity.id]
        this._reusableEntities.add(entity)
    }
}