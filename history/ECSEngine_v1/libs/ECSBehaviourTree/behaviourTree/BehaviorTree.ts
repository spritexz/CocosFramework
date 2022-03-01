import { Time } from "../../ECSEngine/ECS/Utils/Time";
import { Behavior } from "./Behavior";

/**
 * 用来控制BehaviorTree的根类
 */
export class BehaviorTree<T>{
    /**
     * 行为树应该多久更新一次。updatePeriod为0.2将使行为树每秒更新5次
     */
    public updatePeriod: number;
    /**
     * 上下文应包含运行树所需的所有数据
     */
    private _context: T;
    /**
     * 树的根节点
     */
    private _root: Behavior<T>;
    private _elapsedTime: number;

    constructor(context: T, rootNode: Behavior<T>, updatePeriod: number = 0.2) {
        this._context = context;
        this._root = rootNode;

        this.updatePeriod = this._elapsedTime = updatePeriod;
    }

    public tick() {
        // updatePeriod小于或等于0，将每一帧都执行
        if (this.updatePeriod > 0) {
            this._elapsedTime -= Time.deltaTime;
            if (this._elapsedTime <= 0) {
                while (this._elapsedTime <= 0)
                    this._elapsedTime += this.updatePeriod;

                this._root.tick(this._context);
            }
        }
        else {
            this._root.tick(this._context);
        }
    }
}
