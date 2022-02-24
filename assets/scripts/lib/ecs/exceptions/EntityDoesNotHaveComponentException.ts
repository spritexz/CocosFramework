import { Pool } from "../Pool";
import { Exception } from "./Exception";

  /** 
   * 异常: 实体没有该组件
   */
  export class EntityDoesNotHaveComponentException extends Exception {
    public constructor(message:string, index:number) {
      super(message + `实体没有索引(${index})${Pool.componentsEnum[index]}的组件`);
    }
  }