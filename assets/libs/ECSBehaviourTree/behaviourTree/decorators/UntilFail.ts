import { Assert } from "../../core/Assert";
import { TaskStatus } from "../TaskStatus";
import { Decorator } from "./Decorator";

/**
 * 将继续执行其子任务，直到子任务返回失败
 */
export class UntilFail<T> extends Decorator<T>{
    public update(context: T): TaskStatus {
        Assert.isNotNull(this.child, "child必须不为空");

        let status = this.child.update(context);

        if (status != TaskStatus.Failure)
            return TaskStatus.Running;

        return TaskStatus.Success;
    }
}
