///<reference path="./Decorator.ts"/>

import { Assert } from "../../core/Assert";
import { IConditional, isIConditional } from "../conditionals/IConditional";
import { TaskStatus } from "../TaskStatus";
import { Decorator } from "./Decorator";

/**
 * 装饰器，只有在满足条件的情况下才会运行其子程序。
 * 默认情况下，该条件将在每一次执行中被重新评估
 */
export class ConditionalDecorator<T> extends Decorator<T> implements IConditional<T> {
    private _conditional: IConditional<T>;
    private _shouldReevaluate: boolean;
    private _conditionalStatus: TaskStatus = TaskStatus.Invalid;

    constructor(conditional: IConditional<T>, shouldReevalute: boolean = true) {
        super();

        Assert.isTrue(isIConditional(conditional), "conditional 必须继承 IConditional");
        this._conditional = conditional;
        this._shouldReevaluate = shouldReevalute;
    }

    public invalidate() {
        super.invalidate();
        this._conditionalStatus = TaskStatus.Invalid;
    }

    public onStart() {
        this._conditionalStatus = TaskStatus.Invalid;
    }

    public update(context: T): TaskStatus {
        Assert.isNotNull(this.child, "child不能为空");

        this._conditionalStatus = this.executeConditional(context);

        if (this._conditionalStatus == TaskStatus.Success)
            return this.child.tick(context);

        return TaskStatus.Failure;
    }

    /**
     * 在shouldReevaluate标志之后执行条件，或者用一个选项来强制更新。
     * 终止将强制更新，以确保他们在条件变化时得到适当的数据。
     */
    public executeConditional(context: T, forceUpdate: boolean = false): TaskStatus {
        if (forceUpdate || this._shouldReevaluate || this._conditionalStatus == TaskStatus.Invalid)
            this._conditionalStatus = this._conditional.update(context);

        return this._conditionalStatus;
    }
}
