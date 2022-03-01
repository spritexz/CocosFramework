import { Component } from "../../../libs/ECSEngine/ECS/Component";
import { Collider } from "../../../libs/ECSEngine/ECS/Components/Physics/Colliders/Collider";
import { ITriggerListener } from "../../../libs/ECSEngine/ECS/Components/Physics/ITriggerListener";

export class ColliderTrigger extends Component implements ITriggerListener {
    onTriggerEnter(other: Collider, local: Collider) {
        console.log("onTriggerEnter", other, local);
    }

    onTriggerExit(other: Collider, local: Collider) {
        console.log("onTriggerExit", other, local);
    }
}