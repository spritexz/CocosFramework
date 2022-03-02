
import { Exception } from "./Exception";
import { IMatcher } from "../interfaces/IMatcher";

//异常: 匹配器异常
export class MatcherException extends Exception {
    public constructor(matcher: IMatcher) {
        super("matcher.indices.length必须为1, 但当前值为: " + matcher.indices.length)
    }
}