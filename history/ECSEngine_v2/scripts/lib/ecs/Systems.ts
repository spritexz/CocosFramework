import { IExecuteSystem } from "./interfaces/IExecuteSystem";
import { IInitializeSystem } from "./interfaces/IInitializeSystem";
import { ISystem } from "./interfaces/ISystem";


/** 检查对象中是否包含字段 */
function as(object, method: string) {
    return method in object ? object : null
}

export class Systems implements IInitializeSystem, IExecuteSystem {

    /** 初始化系统列表 */
    protected _initializeSystems: Array<IInitializeSystem>;

    /** 执行系统列表 */
    protected _executeSystems: Array<IExecuteSystem>;

    /** 构建系统管理 */
    constructor() {
        this._initializeSystems = [];
        this._executeSystems = [];
    }

    /** 添加系统 */
    public add(system: ISystem);
    public add(system: Function);
    public add(system) {
        if ('function' === typeof system) {
            const Klass: any = system
            system = new Klass()
        }

        const reactiveSystem = as(system, 'subsystem')
        const initializeSystem = reactiveSystem != null
            ? as(reactiveSystem.subsystem, 'initialize')
            : as(system, 'initialize')

        if (initializeSystem != null) {
            const _initializeSystems = this._initializeSystems
            _initializeSystems[_initializeSystems.length] = initializeSystem
        }

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
            this._initializeSystems[i].initialize()
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
}