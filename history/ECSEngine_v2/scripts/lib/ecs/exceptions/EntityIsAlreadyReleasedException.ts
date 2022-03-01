
import { Exception } from "./Exception";

/**
 * 异常: 实体已经被释放
 */
export class EntityIsAlreadyReleasedException extends Exception {
    /**
     * Entity Is Already Released Exception
     * @constructor
     */
    public constructor() {
        super("实体已经被释放!")
    }
}