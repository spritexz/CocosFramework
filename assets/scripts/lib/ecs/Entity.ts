
import { EntityAlreadyHasComponentException } from "./exceptions/EntityAlreadyHasComponentException";
import { EntityIsAlreadyReleasedException } from "./exceptions/EntityIsAlreadyReleasedException";
import { EntityIsNotEnabledException } from "./exceptions/EntityIsNotEnabledException";
import { IComponent } from "./interfaces/IComponent";
import { Pool } from "./Pool";
import { ISignal, Signal } from "./utils/Signal";

/** 事件接口: 实体被释放, 对该实体的所有引用已被释放 */
export interface EntityReleased { (e: Entity): void; }
export interface IEntityReleased<T> extends ISignal<T> {
    dispatch(e: Entity): void;
}

/** 事件接口: 实体数据发生了变化 */
export interface EntityChanged { (e: Entity, index: number, component: IComponent): void; }
export interface IEntityChanged<T> extends ISignal<T> {
    dispatch(e: Entity, index: number, component: IComponent): void;
}

/** 事件接口: 实体的组件被更换 */
export interface ComponentReplaced { (e: Entity, index: number, component: IComponent, replacement: IComponent): void; }
export interface IComponentReplaced<T> extends ISignal<T> {
    dispatch(e: Entity, index: number, component: IComponent, replacement: IComponent): void;
}

/**
 * 实体
 */
export class Entity {

    /** 实体索引计数 */
    public static instanceIndex: number = 0;

    /** 组件列表 */
    public static alloc: Array<Array<IComponent>> = null;

    /** 大小<?> */
    public static size: number = 0;

    /** 实体名字 */
    public name: string = '';

    /** 实体ID */
    public id: string = '';

    /** 实体的索引 */
    public instanceIndex: number = 0;

    /** 实体的创建索引: 在创建时分配给每个实体的唯一的连续索引号 */
    public _creationIndex: number = 0;

    /** 实体的创建索引 */
    public get creationIndex(): number {
        return this._creationIndex;
    }

    /** 是否启用当前实体 */
    public _isEnabled: boolean = true;

    /** 订阅实体被释放事件 */
    public onEntityReleased: IEntityReleased<EntityReleased> = null;

    /** 订阅组件添加事件 */
    public onComponentAdded: IEntityChanged<EntityChanged> = null;

    /** 订阅组件删除事件 */
    public onComponentRemoved: IEntityChanged<EntityChanged> = null;

    /** 订阅组件替换事件 */
    public onComponentReplaced: IComponentReplaced<ComponentReplaced> = null;

    /** 组件列表 */
    public _components: Array<IComponent> = null;

    /** 组件列表缓冲 */
    public _componentsCache: any = null;

    /** 组件索引缓冲 */
    public _componentIndicesCache: number[] = null;

    /** 字符串缓冲 */
    public _toStringCache: string = '';

    /** 引用数量 */
    public _refCount: number = 0;

    /** 缓冲池 */
    private _pool: Pool = null;

    /** 组件枚举 */
    private _componentsEnum: {} = null;

    /**
     * 构建实体
     *  所有东西都是一个实体，可以根据需要添加/删除组件
     */
    constructor(componentsEnum, totalComponents: number = 16) {
        this.onEntityReleased = new Signal<EntityReleased>(this)
        this.onComponentAdded = new Signal<EntityChanged>(this)
        this.onComponentRemoved = new Signal<EntityChanged>(this)
        this.onComponentReplaced = new Signal<ComponentReplaced>(this)
        this._componentsEnum = componentsEnum
        this._pool = Pool.instance
        this._components = this.initialize(totalComponents)
    }

    /**
     * 初始化
     */
    public static initialize(totalComponents: number, options) {
        Entity.size = options.entities || 100
    }

    /**
     * 初始化: 分配实体池.
     */
    public initialize(totalComponents: number): Array<IComponent> {

        //初始化实体池
        const size = Entity.size;
        const alloc = Entity.alloc;
        if (Entity.alloc == null) {
            Entity.dim(totalComponents, size);
        }

        //分配内存池
        this.instanceIndex = Entity.instanceIndex++;
        let mem: Array<IComponent> = alloc[this.instanceIndex];
        if (mem) {
            return mem;
        }

        //实体池内存不足, 扩展实体池容量
        console.log(`${this.instanceIndex}的内存分配不足, 扩展分配${size}个实体.`)
        for (let i = this.instanceIndex, l = i + size; i < l; i++) {
            alloc[i] = new Array(totalComponents)
            for (let k = 0; k < totalComponents; k++) {
                alloc[i][k] = null;
            }
        }
        mem = alloc[this.instanceIndex];
        return mem
    }

    /**
     * 分配实体池
     * @param count 组件数量
     * @param size 最大实体数
     */
    public static dim(count: number, size: number): void {
        Entity.alloc = new Array(size)
        for (let e = 0; e < size; e++) {
            Entity.alloc[e] = new Array(count)
            for (let k = 0; k < count; k++) {
                Entity.alloc[e][k] = null
            }
        }
    }

    /**
     * 添加组件
     */
    public addComponent(index: number, component: IComponent): Entity {
        if (!this._isEnabled) {
            throw new EntityIsNotEnabledException("Cannot add component!")
        }
        if (this.hasComponent(index)) {
            const errorMsg = "Cannot add component at index " + index + " to " + this
            throw new EntityAlreadyHasComponentException(errorMsg, index)
        }
        this._components[index] = component
        this._componentsCache = null
        this._componentIndicesCache = null
        this._toStringCache = null
        const onComponentAdded: any = this.onComponentAdded
        if (onComponentAdded.active) {
            onComponentAdded.dispatch(this, index, component)
        }
        return this
    }








    

    /** 
     * 是否有这个组件
     */
    public hasComponent(index: number): boolean {
        return this._components[index] != null
    }

    /**
     * 是否有这些组件
     */
    public hasComponents(indices: number[]): boolean {
        const _components = this._components
        for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
            if (_components[indices[i]] == null) {
                return false
            }
        }
        return true
    }

    /**
     * 是否有这些任意的组件
     */
    public hasAnyComponent(indices: number[]): boolean {
        const _components = this._components
        for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
            if (_components[indices[i]] != null) {
                return true
            }
        }
        return false
    }

    /**
     * 增加引用计数
     */
    public addRef(): Entity {
        this._refCount += 1
        return this
    }

    /**
     * 释放实体数据
     */
    public release() {
        this._refCount -= 1
        if (this._refCount === 0) {
            let onEntityReleased: any = this.onEntityReleased
            if (onEntityReleased.active) {
                onEntityReleased.dispatch(this)
            }
        } else if (this._refCount < 0) {
            throw new EntityIsAlreadyReleasedException()
        }
    }
}