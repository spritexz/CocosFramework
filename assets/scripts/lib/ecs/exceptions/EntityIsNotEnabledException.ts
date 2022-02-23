import { Exception } from "./Exception";

//异常: 实体未启用
export class EntityIsNotEnabledException extends Exception {
    public constructor(message: string) {
        super(message + "\n实体未启用.")
    }
}