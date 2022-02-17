///<reference path="./Composite.ts" />

import { Vector2 } from "../../../Math/Vector2";
import { Particle } from "../Particle";
import { Composite } from "./Composite";


export class Ball extends Composite {
    constructor(position: Vector2, radius: number = 10) {
        super();
        this.addParticle(new Particle(position)).radius = radius;
    }
}
