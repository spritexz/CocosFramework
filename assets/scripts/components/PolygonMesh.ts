import { Vector2 } from "../../libs/ecs/Math/Vector2";
import { Triangulator } from "../../libs/ecs/Utils/Triangulator";
import { Mesh } from "./Mesh";

export class PolygonMesh extends Mesh {
    constructor(points: Vector2[], arePointsCCW: boolean = true) {
        super();

        const triangulator = new Triangulator();
        triangulator.triangulate(points, arePointsCCW);

        this.setVertPositions(points);
        this.setTriangles(triangulator.triangleIndices);
    }
}