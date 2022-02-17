import { IBatcher } from "../../../Graphics/Batcher/IBatcher";
import { Composite } from "../Composites/Composite";


export abstract class Constraint {
    public composite: Composite;
    public collidesWithColliders: boolean = true;

    public abstract solve(): void;

    public handleCollisions(collidesWithLayers: number) {

    }

    public debugRender(batcher: IBatcher) {

    }
}
