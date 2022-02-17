import { instantiate, Prefab, resources, Sprite } from "cc";
import { Core } from "../../../libs/ECSEngine/Core";
import { BoxCollider } from "../../../libs/ECSEngine/ECS/Components/Physics/Colliders/BoxCollider";
import { Mover } from "../../../libs/ECSEngine/ECS/Components/Physics/Mover";
import { Vector2 } from "../../../libs/ECSEngine/Math/Vector2";
import { CollisionResult } from "../../../libs/ECSEngine/Physics/Shapes/CollisionResult";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";
import { ColliderTrigger } from "./ColliderTrigger";

@sampleScene("collider")
export class ColliderScene extends RenderScene {
    public initialize() {
        let box1 = this.createEntity("box1");
        resources.load('prefabs/moon', Prefab, (err, data) => {
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                box1.addComponent(new ColliderTrigger());
                box1.addComponent(new Mover());
                box1.addComponent(new SpriteRenderer(moonTex))
                if (moonTex.spriteFrame)
                    box1.addComponent(new BoxCollider()).isTrigger = true;
            }
            box1.setPosition(200, 100);
        });

        let box2 = this.createEntity("box2");
        resources.load('prefabs/moon', Prefab, (err, data) => {
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                box2.addComponent(new ColliderTrigger());
                box2.addComponent(new SpriteRenderer(moonTex))
                if (moonTex.spriteFrame)
                    box2.addComponent(new BoxCollider());
            }
            box2.setPosition(100, 200);
        });

        Core.schedule(0, true, this, () => {
            const collisionResult = new CollisionResult();
            box1.getComponent(Mover)?.move(Vector2.up, collisionResult);
        });
    }
}