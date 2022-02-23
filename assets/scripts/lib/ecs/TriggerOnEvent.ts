
import { IMatcher } from "./interfaces/IMatcher";
import { GroupEventType } from "./Matcher";

/**
 * 触发匹配器和分组事件
 */
export class TriggerOnEvent {
    constructor(public trigger: IMatcher, public eventType: GroupEventType) {
    }
}