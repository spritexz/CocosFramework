import { find, instantiate, Prefab, resources, Sprite, view } from "cc";
import { Core } from "../../../libs/ecs/Core";
import { ArcadeRigidbody } from "../../../libs/ecs/ECS/Components/Physics/ArcadeRigidbody";
import { CircleCollider } from "../../../libs/ecs/ECS/Components/Physics/Colliders/CircleCollider";
import { CoreEvents } from "../../../libs/ecs/ECS/CoreEvents";
import { Time } from "../../../libs/ecs/ECS/Utils/Time";
import { Vector2 } from "../../../libs/ecs/Math/Vector2";
import { UUID } from "../../../libs/ecs/Utils/UUID";
import { component_camera } from "../../components/component_camera";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";

@sampleScene("RigidBody")
export class RigidBodyScene extends RenderScene {
    public onStart() {
        // let camera = this.findEntity('camera')?.getComponent(component_camera);
        // if (camera) {
        //     camera.zoom = 2;
        // }
        (this.camera as component_camera).position.add(new Vector2(200, 0))

        resources.load('prefabs/moon', Prefab, (err, data) => {
            this.initAfter(data);
        });
    }

    private initAfter(moonTex: Prefab) {
        let friction = 0.3;
        let elasticity = 0.4;
        this.createBody(new Vector2(50, 200), 50, friction, elasticity, new Vector2(150, 0), moonTex)
            .addImpulse(new Vector2(10, 0));
        this.createBody(new Vector2(800, 260), 5, friction, elasticity, new Vector2(-180, 0), moonTex);

        this.createBody(new Vector2(50, 400), 50, friction, elasticity, new Vector2(150, -40), moonTex);
        this.createBody(new Vector2(800, 460), 5, friction, elasticity, new Vector2(-180, -40), moonTex);

        this.createBody(new Vector2(400, 0), 60, friction, elasticity, new Vector2(10, 90), moonTex);
        this.createBody(new Vector2(500, 400), 4, friction, elasticity, new Vector2(0, -270), moonTex);

        this.createBody(new Vector2(-200, 250), 0, friction, elasticity, new Vector2(0, -270), moonTex);

        this.createBody(new Vector2(200, 700), 15, friction, elasticity, new Vector2(150, -150), moonTex);
        this.createBody(new Vector2(800, 760), 15, friction, elasticity, new Vector2(-180, -150), moonTex);
        this.createBody(new Vector2(1200, 700), 1, friction, elasticity, new Vector2(0, 0), moonTex)
            .addImpulse(new Vector2(-5, -20));

        this.createBody(new Vector2(100, 100), 1, friction, elasticity, new Vector2(100, 90), moonTex)
            .addImpulse(new Vector2(40, -10));
        this.createBody(new Vector2(100, 700), 100, friction, elasticity, new Vector2(200, -270), moonTex);
    }

    private createBody(position: Vector2, mass: number, friction: number, elasticity: number, velocity: Vector2, texture: Prefab) {
        let rigidBody = new ArcadeRigidbody()
            .setMass(mass)
            .setFriction(friction)
            .setElasticity(elasticity)
            .setVelocity(velocity);

        let entity = this.createEntity(UUID.randomUUID());
        let sprite = instantiate(texture).getComponent(Sprite)
        if (sprite) entity.addComponent(new SpriteRenderer(sprite));
        entity.setPosition(position.x, position.y);
        entity.addComponent(rigidBody);
        entity.addComponent(new CircleCollider());

        return rigidBody;
    }

    update() {
        super.update();

        Core.emitter.emit(CoreEvents.renderChanged, Time.deltaTime);
    }
}