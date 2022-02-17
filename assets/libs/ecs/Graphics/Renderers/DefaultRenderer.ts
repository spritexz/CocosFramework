///<reference path="Renderer.ts" />

import { Core } from "../../Core";
import { Scene } from "../../ECS/Scene";
import { ICamera } from "../Batcher/ICamera";
import { Renderer } from "./Renderer";


export class DefaultRenderer extends Renderer {
    constructor(renderOrder: number = 0, camera: ICamera = null) {
        super(renderOrder, camera);
    }

    public render(scene: Scene): void {
        if (!this.renderDirty)
            return;

        this.renderDirty = false;
        let cam = this.camera ? this.camera : scene.camera;
        this.beginRender(cam);

        for (let i = 0; i < scene.renderableComponents.count; i++) {
            let renderable = scene.renderableComponents.get(i);
            if (renderable.enabled && renderable.isVisibleFromCamera(scene.camera))
                this.renderAfterStateCheck(renderable, cam);
        }

        if (this.shouldDebugRender && Core.debugRenderEndabled) {
            this.debugRender(scene);
        }

        this.endRender();
    }
}
