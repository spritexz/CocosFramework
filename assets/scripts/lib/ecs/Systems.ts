import { IExecuteSystem } from "./interfaces/IExecuteSystem";
import { IInitializeSystem } from "./interfaces/IInitializeSystem";
import { ISystem } from "./interfaces/ISystem";
import { World } from "./World";


/** 检查对象中是否包含字段 */
function as(object, method: string) {
    return method in object ? object : null
}

export class Systems implements IInitializeSystem, IExecuteSystem {

    /** 所属世界 */
    private _world: World = null;

    /** 系统列表 */
    private _systems: Array<ISystem>;
    public get systems(): Array<ISystem> {
        return this._systems;
    }

    /** 初始化系统列表 */
    private _initializeSystems: Array<IInitializeSystem>;
    public get initializeSystems(): Array<IInitializeSystem> {
        return this._initializeSystems;
    }

    /** 执行系统列表 */
    private _executeSystems: Array<IExecuteSystem>;
    public get executeSystems(): Array<IExecuteSystem> {
        return this._executeSystems;
    }

    /** 构建系统管理 */
    constructor(world: World) {
        this._world = world;
        this._initializeSystems = [];
        this._executeSystems = [];
        this._systems = []
    }

    /** 添加系统 */
    public add(system: ISystem);
    public add(system: Function);
    public add(system) {
        if ('function' === typeof system) {
            const Klass: any = system
            system = new Klass()
        }

        //记录系统
        this._systems[this._systems.length] = system;

        //分组系统
        const reactiveSystem = as(system, 'subsystem')
        const initializeSystem = reactiveSystem != null ? as(reactiveSystem.subsystem, 'initialize') : as(system, 'initialize')

        //需要初始化的系统
        if (initializeSystem != null) {
            const _initializeSystems = this._initializeSystems
            _initializeSystems[_initializeSystems.length] = initializeSystem
        }

        //需要每帧执行的系统
        const executeSystem: IExecuteSystem = as(system, 'execute')
        if (executeSystem != null) {
            const _executeSystems = this._executeSystems
            _executeSystems[_executeSystems.length] = executeSystem
        }

        return this
    }

    /** 初始化系统 */
    public initialize() {
        for (let i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
            this._initializeSystems[i].initialize(this._world)
        }
    }

    /** 执行系统 */
    public execute() {
        const executeSystems = this._executeSystems
        for (let i = 0, exeSysCount = executeSystems.length; i < exeSysCount; i++) {
            executeSystems[i].execute()
        }
    }

    /** 清理系统 */
    public clearReactiveSystems() {
        for (let i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
            const reactiveSystem = as(this._executeSystems[i], 'subsystem')
            if (reactiveSystem != null) {
                reactiveSystem.clear()
            }

            const nestedSystems: Systems = as(this._executeSystems[i], 'clearReactiveSystems')
            if (nestedSystems != null) {
                nestedSystems.clearReactiveSystems()
            }
        }
    }
    
    /** 释放 */
    release() {
        this.clearReactiveSystems()
        for (let i = 0; i < this._systems.length; i++) {
            const system = this._systems[i];
            system.release()
        }
        this._systems = [];
        this._executeSystems = [];
        this._initializeSystems = [];
    }
}