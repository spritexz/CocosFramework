import { IAction } from "../actions/IAction";
import { FixedScoreConsideration } from "../considerations/FixedScoreConsideration";
import { IConsideration } from "../considerations/IConsideration";

/**
 * UtilityAI的根节点
 */
export abstract class Reasoner<T>{
    public defaultConsideration: IConsideration<T> = new FixedScoreConsideration<T>();

    protected _condiderations: Array<IConsideration<T>> = new Array<IConsideration<T>>();

    public select(context: T): IAction<T> | null {
        let consideration = this.selectBestConsideration(context);
        if (consideration != null)
            return consideration.action;

        return null;
    }

    protected abstract selectBestConsideration(context: T): IConsideration<T>;

    public addConsideration(consideration: IConsideration<T>): Reasoner<T> {
        this._condiderations.push(consideration);

        return this;
    }

    public setDefaultConsideration(defaultConsideration: IConsideration<T>): Reasoner<T> {
        this.defaultConsideration = defaultConsideration;

        return this;
    }
}
