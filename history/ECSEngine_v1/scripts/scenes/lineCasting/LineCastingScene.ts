import { resources, Prefab, instantiate, Sprite } from "cc";
import { BoxCollider } from "../../../libs/ECSEngine/ECS/Components/Physics/Colliders/BoxCollider";
import { Vector2 } from "../../../libs/ECSEngine/Math/Vector2";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";
import { LineCaster } from "./LineCaster";

@sampleScene("lineCasting")
export class LineCastingScene extends RenderScene {
    public initialize() {
        let playerEntity = this.createEntity("player");
        resources.load('prefabs/moon', Prefab, (err, data) => {
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                playerEntity.addComponent(new SpriteRenderer(moonTex))
                if (moonTex.spriteFrame)
                    playerEntity.addComponent(new BoxCollider());
            }
            playerEntity.setPosition(200, 100);
        });


        let lineCaster = this.createEntity("linecaster")
            .addComponent(new LineCaster());
        lineCaster.transform.position = new Vector2(300, 100);
    }
}