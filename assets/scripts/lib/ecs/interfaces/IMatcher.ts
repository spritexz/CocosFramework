import { Entity } from "../Entity";

/** 匹配器接口 */
export interface IMatcher {
    /** 匹配器ID */
    id: number;
    /** 索引列表 */
    indices: number[];
    /** 检查实体是否匹配这个匹配器 */
    matches(entity: Entity);
}

/** 混合匹配器接口 */
export interface ICompoundMatcher extends IMatcher {
    /** 所有的索引列表 */
    allOfIndices: number[];
    /** 任意的索引列表 */
    anyOfIndices: number[];
    /** 不匹配索引列表 */
    noneOfIndices: number[];
}

/** 空匹配器接口 */
export interface INoneOfMatcher extends ICompoundMatcher { 
}

/** 任意匹配器接口 */
export interface IAnyOfMatcher extends ICompoundMatcher {
    /** 不匹配指定的组件或索引 */
    noneOf(...args: any[]): INoneOfMatcher;
}

/** 所有匹配器接口 */
export interface IAllOfMatcher extends ICompoundMatcher {   
    /** 匹配指定的任何组件或索引 */
    anyOf(...args: any[]): IAnyOfMatcher;
    /** 不匹配指定的组件或索引 */
    noneOf(...args: any[]): INoneOfMatcher;
}