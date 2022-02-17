import { Component } from "../../../libs/ecs/ECS/Component";
import { Collider } from "../../../libs/ecs/ECS/Components/Physics/Colliders/Collider";
import { ITriggerListener } from "../../../libs/ecs/ECS/Components/Physics/ITriggerListener";

export class ColliderTrigger extends Component implements ITriggerListener {
    onTriggerEnter(other: Collider, local: Collider) {
        console.log("onTriggerEnter", other, local);
    }

    onTriggerExit(other: Collider, local: Collider) {
        console.log("onTriggerExit", other, local);
    }
}