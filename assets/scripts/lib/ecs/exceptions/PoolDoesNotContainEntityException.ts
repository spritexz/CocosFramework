import { Entity } from "../Entity";
import { Exception } from "./Exception";

/**
 * 异常: Pool中不包含实体
 */
export class PoolDoesNotContainEntityException extends Exception {
    public constructor(entity: Entity, message: string) {
        super(message + `\nPool中不包含实体${entity}`);
    }
}