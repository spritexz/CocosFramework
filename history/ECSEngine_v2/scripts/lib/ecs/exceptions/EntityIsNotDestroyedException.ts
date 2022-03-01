import { Exception } from "./Exception";

//异常: 实体还没有被摧毁
export class EntityIsNotDestroyedException extends Exception {
    /**
     * Entity Is Not Destroyed Exception
     * @constructor
     * @param message
     */
    public constructor(message: string) {
        super(message + "\n实体还没有被摧毁!")
    }
}