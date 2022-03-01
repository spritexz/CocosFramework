/** 用于协调其他系统的通用系统基类 */

import { Entity } from "../Entity";
import { EntitySystem } from "./EntitySystem";


export abstract class ProcessingSystem extends EntitySystem {
    public onChanged(entity: Entity) {

    }

    /** 处理我们的系统 每帧调用 */
    public abstract processSystem();

    protected process(entities: Entity[]) {
        this.begin();
        this.processSystem();
        this.end();
    }
}

