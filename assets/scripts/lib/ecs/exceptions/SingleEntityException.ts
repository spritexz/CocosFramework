import { IMatcher } from "../interfaces/IMatcher";
import { Exception } from "./Exception";

//异常: 单一实体异常, 存在多个匹配项
export class SingleEntityException extends Exception {
    public constructor(matcher: IMatcher) {
        super("单一实体异常, 存在多个匹配项: " + matcher)
    }
}