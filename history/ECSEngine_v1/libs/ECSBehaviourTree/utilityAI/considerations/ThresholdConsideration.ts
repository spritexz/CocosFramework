import { IAction } from "../actions/IAction";
import { IAppraisal } from "./appraisals/IAppraisal";
import { IConsideration } from "./IConsideration";

/**
 * 通过总结子项评估得分，直到子项得分低于阈值
 */
export class ThresholdConsideration<T> implements IConsideration<T>{
    public threshold: number;
    public action!: IAction<T>;
    private _appraisals: Array<IAppraisal<T>> = new Array<IAppraisal<T>>();

    public constructor(threshold: number) {
        this.threshold = threshold;
    }

    public getScore(context: T): number {
        let sum = 0;
        for (let i = 0; i < this._appraisals.length; i++) {
            let score = this._appraisals[i].getScore(context);
            if (score < this.threshold)
                return sum;

            sum += score;
        }

        return sum;
    }
}
