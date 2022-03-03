import { EntityAlreadyHasComponentException } from "./exceptions/EntityAlreadyHasComponentException";
import { EntityDoesNotHaveComponentException } from "./exceptions/EntityDoesNotHaveComponentException";
import { EntityIsAlreadyReleasedException } from "./exceptions/EntityIsAlreadyReleasedException";
import { EntityIsNotEnabledException } from "./exceptions/EntityIsNotEnabledException";
import { IComponent } from "./interfaces/IComponent";
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

    /**
     * 构建实体
     *  所有东西都是一个实体，可以根据需要添加/删除组件
     */
    constructor(componentsMemory: Array<IComponent>) {
        this.onEntityReleased = new Signal<EntityReleased>(this);
        this.onComponentAdded = new Signal<EntityChanged>(this);
        this.onComponentRemoved = new Signal<EntityChanged>(this);
        this.onComponentReplaced = new Signal<ComponentReplaced>(this);
        this._components = componentsMemory;
    }

    /**
     * 添加组件
     */
    public addComponent(index: number, component: IComponent): Entity {
        if (!this._isEnabled) {
            throw new EntityIsNotEnabledException("Cannot add component!")
        }
        if (this.hasComponent(index)) {
            const errorMsg = `不能在索引处添加组件${index}到${this}`
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
     * 移除组件
     */
    public removeComponent(index: number): Entity {
        if (!this._isEnabled) {
            throw new EntityIsNotEnabledException("不能删除组件!")
        }
        if (!this.hasComponent(index)) {
            const errorMsg = `无法从${this}中删除索引${index}处的组件`
            throw new EntityDoesNotHaveComponentException(errorMsg, index)
        }
        this._replaceComponent(index, null)
        return this
    }

    /**
     * 跟换组件, 没有时就添加新的组件
     */
    public replaceComponent(index: number, component: IComponent): Entity {
        if (!this._isEnabled) {
            throw new EntityIsNotEnabledException("不能替代组件!")
        }
        if (this.hasComponent(index)) {
            this._replaceComponent(index, component)
        } else if (component != null) {
            this.addComponent(index, component)
        }
        return this
    }

    /**
     * 跟换组件
     */
    protected _replaceComponent(index: number, replacement: IComponent) {
        const components = this._components;
        const previousComponent = components[index];
        if (previousComponent === replacement) {
            let onComponentReplaced: any = this.onComponentReplaced;
            if (onComponentReplaced.active) {
                onComponentReplaced.dispatch(this, index, previousComponent, replacement);
            }
        } else {
            components[index] = replacement;
            this._componentsCache = null;
            if (replacement == null) {
                //delete components[index]
                components[index] = null;
                this._componentIndicesCache = null;
                this._toStringCache = null;
                const onComponentRemoved: any = this.onComponentRemoved;
                if (onComponentRemoved.active) {
                    onComponentRemoved.dispatch(this, index, previousComponent);
                }
            } else {
                const onComponentReplaced: any = this.onComponentReplaced
                if (onComponentReplaced.active) {
                    onComponentReplaced.dispatch(this, index, previousComponent, replacement);
                }
            }
        }
    }

    /**
     * 获取组件
     */
    public getComponent(index: number): IComponent {
        if (!this.hasComponent(index)) {
            const errorMsg = `无法从${this}获取索引${index}处的组件`;
            throw new EntityDoesNotHaveComponentException(errorMsg, index);
        }
        return this._components[index]
    }

    /** 
     * 获取组件列表
     */
    public getComponents(): IComponent[] {
        if (this._componentsCache == null) {
            const components = []
            const _components = this._components
            for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                const component = _components[i]
                if (component != null) {
                    components[j++] = component
                }
            }
            this._componentsCache = components
        }
        return this._componentsCache
    }

    /**
     * 遍历所有组件
     */
    public foreachComponents(call:(index:number, component:IComponent)=>void) {
        for (let i = 0; i < this._components.length; i++) {
            const element = this._components[i];
            call(i, element);
        }
    }

    /** 
     * 获取组件索引列表
     */
    public getComponentIndices(): number[] {
        if (this._componentIndicesCache == null) {
            const indices = []
            const _components = this._components
            for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                if (_components[i] != null) {
                    indices[j++] = i
                }
            }
            this._componentIndicesCache = indices
        }
        return this._componentIndicesCache
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
     * 是否包含这些组件中任意的一个
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
     * 移除所有组件
     */
    public removeAllComponents() {
        this._toStringCache = null
        const _components = this._components
        for (let i = 0, componentsLength = _components.length; i < componentsLength; i++) {
            if (_components[i] != null) {
                this._replaceComponent(i, null)
            }
        }
    }

    /**
     * 销毁实体数据
     */
    public destroy() {
        this.removeAllComponents()
        this.onComponentAdded.clear()
        this.onComponentReplaced.clear()
        this.onComponentRemoved.clear()
        this._isEnabled = false
    }

    /**
     * 将实体数据转为字符串
     */
    public toString() {
        if (this._toStringCache == null) {
            const sb = []
            const seperator = ", "
            const components = this.getComponents()
            const lastSeperator = components.length - 1
            for (let i = 0, j = 0, componentsLength = components.length; i < componentsLength; i++) {
                sb[j++] = components[i].constructor['name'].replace('Component', '') || i + ''
                if (i < lastSeperator) {
                    sb[j++] = seperator
                }
            }
            this._toStringCache = sb.join('')
        }
        return this._toStringCache
    }

    /**
     * 增加引用计数
     */
    public addRef(): Entity {
        this._refCount += 1
        return this
    }

    /**
     * 引用计数-1, 当等于0时, 释放实体数据
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