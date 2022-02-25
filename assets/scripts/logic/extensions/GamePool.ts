
import { Pool } from "../../lib/ecs/Pool";
import { GameEntity } from "./GameEntity";

export class GamePool extends Pool {
    
    public createPlayer() {
        this.createEntity(GameEntity, 'Player')
            .addVelocity(0, 0)
            .addPosition(10, 10)
            .addResource('prefabs/testSprite')
            .setPlayer(true);
    };
}