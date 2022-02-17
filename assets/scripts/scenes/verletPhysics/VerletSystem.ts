import { IUpdatable } from "../../../libs/ECSEngine/ECS/Components/IUpdatable";
import { RenderableComponent } from "../../../libs/ECSEngine/ECS/Components/Renderables/RenderableComponent";
import { IBatcher } from "../../../libs/ECSEngine/Graphics/Batcher/IBatcher";
import { ICamera } from "../../../libs/ECSEngine/Graphics/Batcher/ICamera";
import { Rectangle } from "../../../libs/ECSEngine/Math/Rectangle";
import { VerletWorld } from "../../../libs/ECSEngine/Physics/Verlet/VerletWorld";
import { component_camera } from "../../components/component_camera";
import { Input } from "../../Input/Input";
import { Keys } from "../../Input/Keys";

export class VerletSystem extends RenderableComponent implements IUpdatable {
    public getwidth() {
        return 960;
    }

    public getheight() {
        return 640;
    }

    public world: VerletWorld;

    constructor() {
        super();

        this.world = new VerletWorld(new Rectangle(-this.getwidth() / 2, -this.getheight() / 2, this.getwidth() / 2, this.getheight() / 2));
        this.world.onHandleDrag = this.handleDragging.bind(this);
    }

    handleDragging() {
        let pos = this.entity.scene.findEntity('camera').getComponent(component_camera).mouseToWorldPoint();
        if (Input.leftMouseButtonPressed) {
            this.world._draggedParticle = this.world.getNearestParticle(pos);
        } else if (Input.leftMouseButtonDown) {
            if (this.world._draggedParticle != null) {
                this.world._draggedParticle.position = pos;
            }
        } else if (Input.leftMouseButtonRelease) {
            if (this.world._draggedParticle != null)
                this.world._draggedParticle.position = pos;
            (this.world._draggedParticle as any) = null;
        }
    }

    toggleZeroGravity() {
        if (this.world.gravity.y == 0) {
            this.world.gravity.y = -980;
        } else {
            this.world.gravity.y = 0;
        }
    }

    update() {
        if (Input.isKeyPressed(Keys.z))
            this.toggleZeroGravity();

        this.world.update();
    }

    render(batcher: IBatcher, camera: ICamera): void {
        this.world.debugRender(batcher);
    }
}