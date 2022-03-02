import { Exception } from "./Exception";

//异常: 实体已经有该组件了
export class EntityAlreadyHasComponentException extends Exception {
    public constructor(message: string, index: number) {
        super(message + `\n实体已经有该组件了(${index}):Pool.ComponentsEnum[${index}]`);
    }
}