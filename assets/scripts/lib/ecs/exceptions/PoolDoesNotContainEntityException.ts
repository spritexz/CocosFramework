
import { Exception } from "./Exception";

/**
 * 异常: Pool中不包含实体
 */
export class PoolDoesNotContainEntityException extends Exception {
    public constructor(entity: any /* Entity */, message: string) {
        super(message + `\nPool中不包含实体${entity}`);
    }
}