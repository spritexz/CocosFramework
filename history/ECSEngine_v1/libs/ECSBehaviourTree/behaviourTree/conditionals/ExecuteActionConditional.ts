import { ExecuteAction } from "../actions/ExecuteAction";
import { TaskStatus } from "../TaskStatus";
import { IConditional } from "./IConditional";

/**
 * 包装一个ExecuteAction，这样它就可以作为一个ConditionalAction使用
 */
export class ExecuteActionConditional<T> extends ExecuteAction<T> implements IConditional<T>{
    public constructor(action: (t: T) => TaskStatus) {
        super(action);
    }
}
