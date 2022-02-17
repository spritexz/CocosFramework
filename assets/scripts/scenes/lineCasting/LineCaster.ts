
import { IUpdatable } from "../../../libs/ecs/ECS/Components/IUpdatable";
import { RenderableComponent } from "../../../libs/ecs/ECS/Components/Renderables/RenderableComponent";
import { Color } from "../../../libs/ecs/Graphics/Batcher/Color";
import { Vector2 } from "../../../libs/ecs/Math/Vector2";
import { Physics } from "../../../libs/ecs/Physics/Physics";
import { component_camera } from "../../components/component_camera";
import { Batcher } from "../../graphics/Batcher";
import { Input } from "../../Input/Input";
import { Keys } from "../../Input/Keys";

export class LineCaster extends RenderableComponent implements IUpdatable {
    private _lastPosition: Vector2 = new Vector2(101, 101);
    private _collisionPosition: Vector2 = new Vector2(-1, -1);

    public getwidth() {
        return 1000;
    }

    public getheight() {
        return 1000;
    }

    public render(batcher: Batcher, camera: component_camera): void {
        batcher.drawPixel(this._lastPosition, new Color(255, 255, 0), 4);
        batcher.end();

        batcher.drawPixel(this.transform.position, new Color(255, 255, 255), 4);
        batcher.end();

        batcher.drawLine(this._lastPosition, this.transform.position, new Color(255, 255, 255), 2);
        batcher.end();

        if (this._collisionPosition.x > 0 && this._collisionPosition.y > 0) {
            batcher.drawPixel(this._collisionPosition, new Color(255, 0, 0), 10);
            batcher.end();
        }
    }

    update() {
        if (Input.leftMouseButtonPressed) {
            this._lastPosition = this.transform.position.clone();
            let pos = this.entity.scene.findEntity('camera').getComponent(component_camera).mouseToWorldPoint();
            this.transform.position = pos.clone();
            this._collisionPosition = new Vector2(-1, -1);
        }

        if (Input.rightMouseButtonPressed || Input.isKeyPressed(Keys.space)) {
            let hit = Physics.linecast(this._lastPosition, this.transform.position);
            if (hit.collider != null) {
                this._collisionPosition = hit.point;
            }
        }
    }
}