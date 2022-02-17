import { instantiate, Prefab, resources, Sprite } from "cc";
import { Core } from "../../../libs/ECSEngine/Core";
import { CircleCollider } from "../../../libs/ECSEngine/ECS/Components/Physics/Colliders/CircleCollider";
import { CoreEvents } from "../../../libs/ECSEngine/ECS/CoreEvents";
import { Time } from "../../../libs/ECSEngine/ECS/Utils/Time";
import { Vector2 } from "../../../libs/ECSEngine/Math/Vector2";
import { Ball } from "../../../libs/ECSEngine/Physics/Verlet/Composites/Ball";
import { Cloth } from "../../../libs/ECSEngine/Physics/Verlet/Composites/Cloth";
import { LineSegments } from "../../../libs/ECSEngine/Physics/Verlet/Composites/LineSegments";
import { Ragdoll } from "../../../libs/ECSEngine/Physics/Verlet/Composites/Ragdoll";
import { Tire } from "../../../libs/ECSEngine/Physics/Verlet/Composites/Tire";
import { VerletWorld } from "../../../libs/ECSEngine/Physics/Verlet/VerletWorld";
import { RandomUtils } from "../../../libs/ECSEngine/Utils/Extensions/RandomUtils";
import { PolygonMesh } from "../../components/PolygonMesh";
import { PolygonSprite } from "../../components/PolygonSprite";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";
import { VerletSystem } from "./VerletSystem";

@sampleScene("Verlet Physics")
export class VerletPhysicsScene extends RenderScene {
    initialize() {
        const verletSystem = this.createEntity("verlet-system")
            .addComponent(new VerletSystem());

        this.createPolygons();

        this.createRope(verletSystem.world);

        verletSystem.world.addComposite(new Tire(new Vector2(175, 32), 64, 32, 0.3, 0.5));
        verletSystem.world.addComposite(new Tire(new Vector2(300, 16), 50, 4, 0.2, 0.7));
        verletSystem.world.addComposite(new Tire(new Vector2(450, 64), 64, 7, 0.1, 0.3));

        verletSystem.world.addComposite(new Cloth(new Vector2(200, 200), 200, 200, 20, 0.25, 50));

        verletSystem.world.addComposite(new Ragdoll(200, 20, RandomUtils.randint(140, 240)));
        verletSystem.world.addComposite(new Ragdoll(250, 20, RandomUtils.randint(140, 240)));
        verletSystem.world.addComposite(new Ragdoll(300, 20, RandomUtils.randint(140, 240)));

        verletSystem.world.addComposite(new Ball(new Vector2(100, 60), RandomUtils.randint(10, 50)));
        verletSystem.world.addComposite(new Ball(new Vector2(150, 60), RandomUtils.randint(10, 50)));
        verletSystem.world.addComposite(new Ball(new Vector2(200, 60), RandomUtils.randint(10, 50)));
    }

    createPolygons() {
        // const trianglePoints: Vector2[] = [new Vector2(0, 0), new Vector2(128, 0), new Vector2(128, 128)];
        // const triangleEntity = this.createEntity("triangle");

        // resources.load('prefabs/moon_polygon', Prefab, (err, data) => {
        //     let moonTex = instantiate(data).getComponent(PolygonSprite)!;
        //     triangleEntity.setPosition(50, 150);
        //     triangleEntity.addComponent(new PolygonMesh(trianglePoints, false)).setColor(Color.Green).setTexture(moonTex);
        //     triangleEntity.addComponent(new PolygonCollider(trianglePoints));
        // });

        const circleEntity = this.createEntity("circle");
        resources.load('prefabs/moon', Prefab, (err, data) => {
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) circleEntity.addComponent(new SpriteRenderer(moonTex));
            circleEntity.setPosition(250, 60);
            circleEntity.addComponent(new CircleCollider(64));
        });


        // const polyPoints = Polygon.buildSymmetricalPolygon(5, 140);
        // const polygonEntity = this.createEntity("boxCollider");
        // resources.load('prefabs/moon_polygon', Prefab, (err, data) => {
        //     let moonTex = instantiate(data).getComponent(PolygonSprite)!;
        //     polygonEntity.setPosition(230, 225);
        //     polygonEntity.addComponent(new PolygonMesh(polyPoints)).setColor(Color.Green).setTexture(moonTex);
        //     polygonEntity.addComponent(new PolygonCollider(polyPoints));
        // });

        // polygonEntity.tweenRotationDegreesTo(180, 3)
        //     .setLoops(LoopType.pingpong, 50)
        //     .setEaseType(EaseType.linear)
        //     .start();
    }

    createRope(world: VerletWorld) {
        const linePoints = [];
        for (var i = 0; i < 10; i++)
            linePoints[i] = new Vector2(30 * i + 50, 10);

        const line = new LineSegments(linePoints, 0.3)
            .pinParticleAtIndex(0);
        world.addComposite(line);
    }

    update() {
        super.update();

        Core.emitter.emit(CoreEvents.renderChanged, Time.deltaTime);
    }
}