
import { Exception } from "./Exception";

/** 
 * 异常: 实体没有该组件
 */
export class EntityDoesNotHaveComponentException extends Exception {
    public constructor(message: string, index: number) {
        super(message + `\n没有实体索引(${index}):Pool.ComponentsEnum[${index}]`);
    }
}