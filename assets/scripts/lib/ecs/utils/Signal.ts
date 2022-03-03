import { BatchingUtility } from "cc";
import { Bag } from "./Bag";

/** 
 * 事件处理接口
 */
export interface ISignal<T> {
    /** 派遣事件 */
    dispatch(...args: any[]): void;
    /** 添加事件 */
    add(listener: T, context: Object): void;
    /** 清除事件 */
    clear(): void;
    /** 移除事件 */
    remove(listener: T, context: Object): void;
}

type listenerType = { call: any, context: Object }

/** 
 * 事件处理器
 */
export class Signal<T> implements ISignal<T> {

    /** 监听列表 */
    public _listeners: Bag<listenerType>;

    /** 上下文 */
    private _context: any;

    /** <?> */
    private _alloc: number;

    /** 是否有效 */
    public active: boolean;

    /** 构建事件处理器 */
    constructor(context: any, alloc: number = 16) {
        this._listeners = new Bag<listenerType>();
        this._context = context;
        this._alloc = alloc;
        this.active = false;
    }

    /**
     * 派发事件
     */
    dispatch(...args: any[]): void {
        const listeners: Bag<listenerType> = this._listeners;
        const size = listeners.size();
        if (size <= 0) {
            return;
        }
        const context = this._context;
        for (let i = 0; i < size; i++) {
            listeners[i].call.apply(listeners[i].context, args);
        }
    }

    /**
     * 添加事件监听器
     */
    add(listener: T, context: Object): void {
        this._listeners.add({call: listener, context});
        this.active = true;
    }

    /**
     * 移除事件监听
     */
    remove(listener: T, context: Object): void {
        const listeners = this._listeners;
        listeners.remove({ call: listener, context }, (e1: listenerType, e2: listenerType) => {
            return (e1.call == e2.call && e1.context == e2.context)
        });
        this.active = listeners.size() > 0;
    }

    /**
     * 清除并重置为原始的配置
     */
    clear(): void {
        this._listeners.clear();
        this.active = false;
    }
}