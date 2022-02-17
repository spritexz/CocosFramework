import { IBatcher } from "./Batcher/IBatcher";


export class Graphics {
    public static instance: Graphics;
    public batcher: IBatcher;

    constructor(batcher: IBatcher) {
        this.batcher = batcher;
    }
}
