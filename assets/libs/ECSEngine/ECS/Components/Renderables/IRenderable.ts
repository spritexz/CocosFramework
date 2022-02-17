import { IBatcher } from "../../../Graphics/Batcher/IBatcher";
import { ICamera } from "../../../Graphics/Batcher/ICamera";


export interface IRenderable {
    enabled: boolean;
    renderLayer: number;
    isVisibleFromCamera(camera: ICamera): boolean;
    render(batcher: IBatcher, camera: ICamera): void;
    debugRender(batcher: IBatcher): void;
}
