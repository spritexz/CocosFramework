///<reference path="./Selector.ts"/>

import { ArrayExt } from "../../core/ArrayExt";
import { Selector } from "./Selector";

/**
 * 与选择器相同，但它会在启动时无序处理子项
 */
export class RandomSelector<T> extends Selector<T>{
    public onStart() {
        ArrayExt.shuffle(this._children);
    }
}
