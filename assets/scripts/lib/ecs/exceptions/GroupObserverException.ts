import { Exception } from "./Exception";

/** 
 * 分组观察者异常
 */
export class GroupObserverException extends Exception {
    public constructor(message: string) {
        super(message)
    }
}