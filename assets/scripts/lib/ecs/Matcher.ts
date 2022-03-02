import { Entity } from "./Entity";
import { MatcherException } from "./exceptions/MatcherException";
import { IAllOfMatcher, IAnyOfMatcher, IMatcher, INoneOfMatcher } from "./interfaces/IMatcher";
import { TriggerOnEvent } from "./TriggerOnEvent";

/** 分组事件类型 */
export enum GroupEventType {
    /** 增加实体 */
    OnEntityAdded,
    /** 移除实体 */
    OnEntityRemoved,
    /** 增加或移除实体 */
    OnEntityAddedOrRemoved
}

export class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {

    /** 分配给每个匹配器唯一的连续索引号 */
    public static uniqueId: number = 0

    /** 匹配器ID */
    private _id: number;

    /** 组件序数的列表 */
    private _indices: number[];

    /** 实体的索引号列表 */
    public _allOfIndices: number[];
    public _anyOfIndices: number[];
    public _noneOfIndices: number[];

    /** 字符串缓冲 */
    private _toStringCache: string;

    /** 获取匹配器ID */
    public get id(): number {
        return this._id;
    }

    /** 获取此匹配的组件序数的列表 */
    public get indices(): number[] {
        if (!this._indices) {
            this._indices = this.mergeIndices();
        }
        return this._indices;
    }

    /** 获取每个实体的索引号列表 */
    public get allOfIndices(): number[] {
        return this._allOfIndices;
    }

    /** 获取每个实体的索引号列表 */
    public get anyOfIndices(): number[] {
        return this._anyOfIndices;
    }

    /** 获取每个实体的索引号列表 */
    public get noneOfIndices(): number[] {
        return this._noneOfIndices;
    }

    /** 
     * 构建匹配器
     */
    constructor() {
        this._id = Matcher.uniqueId++;
    }

    /**
     * 订阅实体添加事件
     */
    public onEntityAdded(): TriggerOnEvent {
        return new TriggerOnEvent(this, GroupEventType.OnEntityAdded)
    }

    /**
     * 订阅实体移除事件
     * @returns {entitas.TriggerOnEvent}
     */
    public onEntityRemoved(): TriggerOnEvent {
        return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved)
    }

    /**
     * 订阅实体添加或删除事件
     * @returns {entitas.TriggerOnEvent}
     */
    public onEntityAddedOrRemoved(): TriggerOnEvent {
        return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved)
    }

    /** 
     * 匹配指定的任何组件或索引
     */
    public anyOf(...args: Array<IMatcher>): IAnyOfMatcher;
    public anyOf(...args: number[]): IAnyOfMatcher;
    public anyOf(...args: any[]): IAnyOfMatcher {
        if ('number' === typeof args[0] || 'string' === typeof args[0]) {
            this._anyOfIndices = Matcher.distinctIndices(args)
            this._indices = null
            return this
        } else {
            return this.anyOf.apply(this, Matcher.mergeIndices(args))
        }
    }

    /**
     * 不匹配指定的组件或索引
     */
    public noneOf(...args: number[]): INoneOfMatcher
    public noneOf(...args: Array<IMatcher>): INoneOfMatcher
    public noneOf(...args: any[]): INoneOfMatcher {
        if ('number' === typeof args[0] || 'string' === typeof args[0]) {
            this._noneOfIndices = Matcher.distinctIndices(args)
            this._indices = null
            return this
        } else {
            return this.noneOf.apply(this, Matcher.mergeIndices(args))
        }
    }

    /**
     * 匹配指定的所有组件或索引 
     */
    public static allOf(...args: number[]): IAllOfMatcher;
    public static allOf(...args: Array<IMatcher>): IAllOfMatcher;
    public static allOf(...args: any[]): IAllOfMatcher {
        if ('number' === typeof args[0] || 'string' === typeof args[0]) {
            const matcher = new Matcher()
            const indices = matcher._allOfIndices = Matcher.distinctIndices(args)
            return matcher
        } else {
            return Matcher.allOf.apply(this, Matcher.mergeIndices(args))
        }
    }


    /**
     * 匹配指定的任何组件或索引
     */
    public static anyOf(...args: number[]): IAnyOfMatcher
    public static anyOf(...args: Array<IMatcher>): IAnyOfMatcher
    public static anyOf(...args: any[]): IAnyOfMatcher {
        if ('number' === typeof args[0] || 'string' === typeof args[0]) {
            const matcher = new Matcher()
            const indices = matcher._anyOfIndices = Matcher.distinctIndices(args)
            return matcher
        } else {
            return Matcher.anyOf.apply(this, Matcher.mergeIndices(args))
        }
    }

    /**
     * 将匹配器转为string表示
     */
    public toString() {
        if (this._toStringCache == null) {
            const sb: string[] = []
            if (this._allOfIndices != null) {
                Matcher.appendIndices(sb, "AllOf", this._allOfIndices)
            }
            if (this._anyOfIndices != null) {
                if (this._allOfIndices != null) {
                    sb[sb.length] = '.'
                }
                Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices)
            }
            if (this._noneOfIndices != null) {
                Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices)
            }
            this._toStringCache = sb.join('')
        }
        return this._toStringCache
    }


    /** 
     * 检查实体是否匹配这个匹配器 
     */
    public matches(entity: Entity): boolean {
        const matchesAllOf = this._allOfIndices == null ? true : entity.hasComponents(this._allOfIndices)
        const matchesAnyOf = this._anyOfIndices == null ? true : entity.hasAnyComponent(this._anyOfIndices)
        const matchesNoneOf = this._noneOfIndices == null ? true : !entity.hasAnyComponent(this._noneOfIndices)
        return matchesAllOf && matchesAnyOf && matchesNoneOf
    }

    /**
     * 合并组件索引的列表
     */
    public mergeIndices(): number[] {
        let indicesList = []
        if (this._allOfIndices != null) {
            indicesList = indicesList.concat(this._allOfIndices)
        }
        if (this._anyOfIndices != null) {
            indicesList = indicesList.concat(this._anyOfIndices)
        }
        if (this._noneOfIndices != null) {
            indicesList = indicesList.concat(this._noneOfIndices)
        }
        return Matcher.distinctIndices(indicesList)
    }

    /** 合并一组匹配器的所有索引 */
    public static mergeIndices(matchers: Array<IMatcher>): number[] {
        const indices = []
        for (let i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
            const matcher = matchers[i]
            if (matcher.indices.length !== 1) {
                throw new MatcherException(matcher)
            }
            indices[i] = matcher.indices[0]
        }
        return indices
    }

    /** 获取列表中不同(非重复)索引的集合 */
    public static distinctIndices(indices: number[]): number[] {
        const indicesSet = {}
        for (let i = 0, l = indices.length; i < l; i++) {
            const k = '' + indices[i]
            indicesSet[k] = i
        }
        return [].concat(Object.keys(indicesSet))
    }

    /** 附加索引 */
    private static appendIndices(sb: string[], prefix: string, indexArray: number[]) {
        const SEPERATOR = ", "
        let j = sb.length
        sb[j++] = prefix
        sb[j++] = '('
        const lastSeperator = indexArray.length - 1
        for (let i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
            sb[j++] = '' + indexArray[i]
            if (i < lastSeperator) {
                sb[j++] = SEPERATOR
            }
        }
        sb[j++] = ')'
    }
}